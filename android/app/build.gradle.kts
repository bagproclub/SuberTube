plugins {
    id("com.android.application")
}

android {
    namespace = "com.subertube.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.subertube.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    // ✅ Signing configuration for Release builds
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("KEYSTORE_PATH") ?: "keystore.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: ""
            keyAlias = System.getenv("KEY_ALIAS") ?: ""
            keyPassword = System.getenv("KEY_PASSWORD") ?: ""
        }
    }

    buildTypes {
        debug {
            isDebuggable = true
            isMinifyEnabled = false
            isShrinkResources = false
        }

        release {
            isDebuggable = false
            isMinifyEnabled = true          // ✅ R8 Code Shrinking enabled
            isShrinkResources = true        // ✅ Remove unused resources
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    packagingOptions {
        exclude("META-INF/proguard/androidx-*.pro")
    }

    lint {
        abortOnError = true
        missingDimensionStrategy("store", "play")
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.17.1")
}
