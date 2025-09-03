# Encryption Key Management

## Overview

The Quizmaster application uses AES encryption to create secure hashes of question IDs for URL usage. This document explains how to properly manage the encryption key in different environments.

## Security Requirements

### Development Environment
- Use the default key provided in `application-dev.properties`
- This is acceptable for local development only

### Production Environment
- **NEVER** use the default key in production
- Set a secure 32-character encryption key via environment variable
- Use a cryptographically secure random key generator

## Configuration

### Environment Variable
Set the `QUIZMASTER_ENCRYPTION_KEY` environment variable:

```bash
export QUIZMASTER_ENCRYPTION_KEY="your-secure-32-character-key-here"
```

### Application Properties
The key can also be set in application properties:

```properties
quizmaster.encryption.key=${QUIZMASTER_ENCRYPTION_KEY:default-key-for-dev-only}
```

## Key Generation

### Generate a Secure Key
Use one of these methods to generate a secure 32-character key:

#### Using OpenSSL
```bash
openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
```

#### Using Java
```java
import java.security.SecureRandom;
import java.util.Base64;

SecureRandom random = new SecureRandom();
byte[] key = new byte[32];
random.nextBytes(key);
String keyString = Base64.getEncoder().encodeToString(key).substring(0, 32);
```

#### Using Online Generator (for development only)
- Use a cryptographically secure random string generator
- Ensure the key is exactly 32 characters long

## Security Best Practices

1. **Never commit encryption keys to version control**
2. **Use different keys for different environments**
3. **Rotate keys periodically in production**
4. **Store keys securely (e.g., in environment variables, secret management systems)**
5. **Monitor key usage and access**

## Key Rotation

If you need to rotate the encryption key:

1. **Backup existing data** - old hashes will become invalid
2. **Update the key** in your environment
3. **Restart the application**
4. **Regenerate any existing hashes** if needed

## Troubleshooting

### Application Won't Start
- Ensure `QUIZMASTER_ENCRYPTION_KEY` is set
- Verify the key is at least 16 characters long
- Check for typos in the environment variable name

### Decryption Errors
- Verify the key matches the one used for encryption
- Check if the key was recently changed
- Ensure the hash format is correct

## Migration from Hardcoded Key

If migrating from the old hardcoded key:

1. The old key `UMNBKJHUMNASDGIUASDKJHVIYWKJASGS` is still supported for backward compatibility
2. Set your new secure key via environment variable
3. Existing hashes will continue to work with the old key
4. New hashes will use the new key

## Security Considerations

- **ECB Mode**: The current implementation uses ECB mode, which is not ideal for security
- **Future Enhancement**: Consider upgrading to AES/GCM/NoPadding for better security
- **Key Storage**: Never store keys in plain text files or configuration files in production
