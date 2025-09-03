package cz.scrumdojo.quizmaster.service;

import cz.scrumdojo.quizmaster.config.EncryptionProperties;
import cz.scrumdojo.quizmaster.exception.EncryptionException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Service for encrypting and decrypting question IDs.
 *
 * This service provides a secure way to hash question IDs for use in URLs
 * while maintaining the ability to decrypt them back to the original ID.
 */
@Service
public class EncryptionService {

    private final EncryptionProperties encryptionProperties;

    public EncryptionService(EncryptionProperties encryptionProperties) {
        this.encryptionProperties = encryptionProperties;
        validateConfiguration();
    }

    /**
     * Encrypts a question ID to create a secure hash for URL usage.
     *
     * @param questionId the question ID to encrypt
     * @return Base64-encoded encrypted string
     * @throws EncryptionException if encryption fails
     */
    public String encryptQuestionId(Integer questionId) {
        if (questionId == null) {
            throw new IllegalArgumentException("Question ID cannot be null");
        }

        try {
            byte[] keyBytes = getKeyBytes();
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, encryptionProperties.getAlgorithm());
            Cipher cipher = Cipher.getInstance(encryptionProperties.getTransformation());
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);

            byte[] questionIdBytes = questionId.toString().getBytes(StandardCharsets.UTF_8);
            byte[] encrypted = cipher.doFinal(questionIdBytes);

            return Base64.getUrlEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new EncryptionException("Failed to encrypt question ID: " + questionId, e);
        }
    }

    /**
     * Decrypts a hash back to the original question ID.
     *
     * @param hash the encrypted hash to decrypt
     * @return the original question ID
     * @throws EncryptionException if decryption fails
     */
    public Integer decryptQuestionId(String hash) {
        if (!StringUtils.hasText(hash)) {
            throw new IllegalArgumentException("Hash cannot be null or empty");
        }

        try {
            byte[] keyBytes = getKeyBytes();
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, encryptionProperties.getAlgorithm());
            Cipher cipher = Cipher.getInstance(encryptionProperties.getTransformation());
            cipher.init(Cipher.DECRYPT_MODE, keySpec);

            byte[] decodedBytes = Base64.getUrlDecoder().decode(hash);
            byte[] decrypted = cipher.doFinal(decodedBytes);
            String questionIdString = new String(decrypted, StandardCharsets.UTF_8);

            return Integer.parseInt(questionIdString);
        } catch (Exception e) {
            throw new EncryptionException("Failed to decrypt hash: " + hash, e);
        }
    }

    /**
     * Gets the encryption key bytes, ensuring proper length for the algorithm.
     */
    private byte[] getKeyBytes() {
        String key = encryptionProperties.getKey();
        if (!StringUtils.hasText(key)) {
            throw new IllegalStateException("Encryption key is not configured");
        }

        // For AES, we need exactly 16, 24, or 32 bytes
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);

        if (keyBytes.length == 16 || keyBytes.length == 24 || keyBytes.length == 32) {
            return keyBytes;
        }

        // If key is not the right length, hash it to get the right size
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            return sha.digest(keyBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new EncryptionException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Validates the encryption configuration on startup.
     */
    private void validateConfiguration() {
        if (!StringUtils.hasText(encryptionProperties.getKey())) {
            throw new IllegalStateException(
                "Encryption key is not configured. " +
                "Please set QUIZMASTER_ENCRYPTION_KEY environment variable or " +
                "quizmaster.encryption.key property"
            );
        }

        if (encryptionProperties.getKey().length() < 16) {
            throw new IllegalStateException(
                "Encryption key must be at least 16 characters long for security"
            );
        }
    }
}
