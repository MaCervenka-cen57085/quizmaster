package cz.scrumdojo.quizmaster.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for encryption settings.
 *
 * Security Note: The encryption key should be provided via environment variables
 * or secure key management systems, never hardcoded in the application.
 */
@Configuration
@ConfigurationProperties(prefix = "quizmaster.encryption")
public class EncryptionProperties {

    /**
     * The encryption key for question ID hashing.
     * Should be a 32-character string for AES-256.
     *
     * Set via environment variable: QUIZMASTER_ENCRYPTION_KEY
     * Or application property: quizmaster.encryption.key
     */
    private String key;

    /**
     * The encryption algorithm to use.
     * Defaults to AES for backward compatibility.
     */
    private String algorithm = "AES";

    /**
     * The encryption transformation to use.
     * Defaults to AES/ECB/PKCS5Padding for backward compatibility.
     *
     * Note: ECB mode is not secure for production use.
     * Consider upgrading to AES/GCM/NoPadding for better security.
     */
    private String transformation = "AES/ECB/PKCS5Padding";

    // Getters and setters
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getTransformation() {
        return transformation;
    }

    public void setTransformation(String transformation) {
        this.transformation = transformation;
    }
}
