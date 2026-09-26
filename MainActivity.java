package com.subertube.app;

import android.app.Activity;
import android.app.PictureInPictureParams;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.widget.FrameLayout;
import android.media.AudioManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import java.util.Locale;

public final class MainActivity extends Activity {
    private static final String APP_HOME = "https://appassets.androidplatform.net/assets/index.html";
    private static final String YOUTU_BE_HOST = "youtu.be";

    private FrameLayout root;
    private WebView webView;
    private View fullscreenView;
    private WebChromeClient.CustomViewCallback fullscreenCallback;
    private boolean videoOpen;
    private WebViewAssetLoader assetLoader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        root = findViewById(R.id.root_container);
        getWindow().setStatusBarColor(android.graphics.Color.rgb(8, 8, 12));
        getWindow().setNavigationBarColor(android.graphics.Color.rgb(8, 8, 12));
        setVolumeControlStream(AudioManager.STREAM_MUSIC);
        WebView.enableSafeBrowsing(this, null);

        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        configureWebView();
        webView.loadUrl(APP_HOME);
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setDatabaseEnabled(false);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setGeolocationEnabled(false);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setWebViewClient(new SuberTubeWebViewClient());
        webView.setWebChromeClient(new SuberTubeChromeClient());
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            // Downloads are intentionally not handed to external applications.
        });
    }

    private final class SuberTubeWebViewClient extends WebViewClientCompat {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return assetLoader.shouldInterceptRequest(request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(view, request.getUrl(), request.isForMainFrame());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleNavigation(view, Uri.parse(url), true);
        }

        @Override
        public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
            videoOpen = isAppVideoUrl(Uri.parse(url));
            super.onPageStarted(view, url, favicon);
        }
    }

    private boolean handleNavigation(WebView view, Uri uri, boolean isMainFrame) {
        if (uri == null || uri.getScheme() == null) {
            return true;
        }

        final String scheme = uri.getScheme().toLowerCase(Locale.ROOT);
        if (!"https".equals(scheme)) {
            // Block intent://, youtube://, market://, tel:, mailto:, and other external handlers.
            return true;
        }

        if (!isMainFrame) {
            return false;
        }

        if (isAppOriginUrl(uri)) {
            String path = uri.getPath() == null ? "" : uri.getPath();
            if (path.isEmpty() || "/".equals(path)) {
                view.post(() -> view.loadUrl(APP_HOME));
                return true;
            }
            if (path.equals("/assets/index.html") || path.startsWith("/assets/")) {
                return false;
            }
            return true;
        }

        String videoId = extractYouTubeVideoId(uri);
        if (videoId != null) {
            videoOpen = true;
            final String destination = APP_HOME + "?video=" + Uri.encode(videoId);
            // Defer local navigation until after shouldOverrideUrlLoading returns.
            // Android documents against calling loadUrl directly from this callback.
            view.post(() -> view.loadUrl(destination));
            return true;
        }

        if (isYouTubeHost(uri.getHost())) {
            // Keep real YouTube discovery pages inside this WebView. A selected video is routed back to the app's IFrame path above.
            return false;
        }

        // Do not let arbitrary third-party top-level pages become an uncontrolled browsing surface.
        return true;
    }

    private boolean isAppOriginUrl(Uri uri) {
        return uri != null
                && "https".equalsIgnoreCase(uri.getScheme())
                && "appassets.androidplatform.net".equalsIgnoreCase(uri.getHost());
    }

    private boolean isAppAssetUrl(Uri uri) {
        if (!isAppOriginUrl(uri)) return false;
        String path = uri.getPath();
        return path != null && (path.equals("/assets/index.html") || path.startsWith("/assets/"));
    }

    private boolean isAppVideoUrl(Uri uri) {
        if (uri == null || !isAppOriginUrl(uri)) return false;
        String path = uri.getPath();
        if (path != null && !path.equals("/") && !path.isEmpty() && !path.startsWith("/assets/")) return false;
        String id = uri.getQueryParameter("video");
        return isValidVideoId(id);
    }

    private boolean isYouTubeHost(String host) {
        if (host == null) return false;
        String h = host.toLowerCase(Locale.ROOT);
        return h.equals("www.youtube.com") || h.equals("youtube.com") || h.equals("m.youtube.com") || h.equals(YOUTU_BE_HOST);
    }

    private String extractYouTubeVideoId(Uri uri) {
        if (uri == null || !"https".equalsIgnoreCase(uri.getScheme())) return null;
        String host = uri.getHost();
        if (host == null) return null;
        host = host.toLowerCase(Locale.ROOT);

        if (host.equals(YOUTU_BE_HOST)) {
            String[] segments = uri.getPathSegments().toArray(new String[0]);
            if (segments.length > 0) return normalizeVideoId(segments[0]);
            return null;
        }

        if (!(host.equals("www.youtube.com") || host.equals("youtube.com") || host.equals("m.youtube.com"))) return null;
        String path = uri.getPath() == null ? "" : uri.getPath();
        if (path.equals("/watch")) return normalizeVideoId(uri.getQueryParameter("v"));

        String[] parts = path.split("/");
        if (parts.length >= 3 && (parts[1].equals("shorts") || parts[1].equals("live") || parts[1].equals("embed"))) {
            return normalizeVideoId(parts[2]);
        }

        if (path.equals("/attribution_link")) {
            for (String key : new String[]{"u", "q", "url"}) {
                String nested = uri.getQueryParameter(key);
                if (nested == null || nested.isEmpty()) continue;
                try {
                    String nestedId = extractYouTubeVideoId(Uri.parse(nested));
                    if (nestedId != null) return nestedId;
                } catch (RuntimeException ignored) {
                    // Ignore malformed nested navigation values.
                }
            }
        }
        return null;
    }

    private String normalizeVideoId(String candidate) {
        if (candidate == null || !candidate.matches("[A-Za-z0-9_-]{11}")) return null;
        return candidate;
    }

    private boolean isValidVideoId(String candidate) {
        return normalizeVideoId(candidate) != null;
    }

    private final class SuberTubeChromeClient extends WebChromeClient {
        @Override
        public void onShowCustomView(View view, CustomViewCallback callback) {
            if (fullscreenView != null) {
                callback.onCustomViewHidden();
                return;
            }
            fullscreenView = view;
            fullscreenCallback = callback;
            root.addView(view, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));
            webView.setVisibility(View.GONE);
            setImmersive(true);
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
        }

        @Override
        public void onHideCustomView() {
            exitFullscreen();
        }
    }

    private void exitFullscreen() {
        if (fullscreenView == null) return;
        root.removeView(fullscreenView);
        fullscreenView = null;
        if (fullscreenCallback != null) {
            fullscreenCallback.onCustomViewHidden();
            fullscreenCallback = null;
        }
        webView.setVisibility(View.VISIBLE);
        setImmersive(false);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
    }

    private void setImmersive(boolean immersive) {
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController controller = window.getInsetsController();
            if (controller == null) return;
            if (immersive) {
                controller.hide(WindowInsets.Type.systemBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            } else {
                controller.show(WindowInsets.Type.systemBars());
            }
        } else {
            int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
            if (immersive) {
                flags |= View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            }
            window.getDecorView().setSystemUiVisibility(flags);
        }
    }

    @Override
    public void onUserLeaveHint() {
        super.onUserLeaveHint();
        if (!videoOpen || fullscreenView != null || Build.VERSION.SDK_INT < Build.VERSION_CODES.O || isInPictureInPictureMode()) return;
        PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder();
        builder.setAspectRatio(new android.util.Rational(16, 9));
        enterPictureInPictureMode(builder.build());
    }

    @Override
    protected void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, android.content.res.Configuration newConfig) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
        if (webView != null) {
            webView.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onBackPressed() {
        if (fullscreenView != null) {
            exitFullscreen();
            return;
        }
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
        // Recover from renderer termination instead of leaving a blank/broken shell.
        if (webView != null && view == webView) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            root.removeView(webView);
            webView.destroy();
            webView = null;
            recreate();
        }
        return true;
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
