# ProGuard rules for SuberTube Android App

# ============================================
# Keep Android Framework classes
# ============================================
-keep public class android.app.Activity { *; }
-keep public class android.app.Application { *; }
-keep public class android.webkit.WebView { *; }
-keep public class android.webkit.WebViewClient { *; }
-keep public class android.webkit.WebChromeClient { *; }

# ============================================
# Keep our application code
# ============================================
-keep public class com.subertube.app.MainActivity { *; }
-keep public class com.subertube.app.MainActivity$* { *; }
-keepclassmembers class com.subertube.app.** {
    public <methods>;
    public <fields>;
}

# ============================================
# Keep AndroidX classes
# ============================================
-keep class androidx.webkit.** { *; }
-keep interface androidx.webkit.** { *; }

# ============================================
# Remove logging in release builds
# ============================================
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# ============================================
# Optimization options
# ============================================
-optimizationpasses 5
-allowaccessmodification
-mergeinterfacesaggressively
-repackageclasses 'com.subertube.app.internal'

# ============================================
# Verbose output
# ============================================
-verbose
-printmapping mapping.txt
-printconfiguration configuration.txt
