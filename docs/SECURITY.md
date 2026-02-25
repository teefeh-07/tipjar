# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email security concerns to the maintainers
3. Include steps to reproduce the vulnerability
4. Allow 48 hours for an initial response

## Security Practices

- Smart contracts audited with Clarinet check_checker
- No private keys stored in source code
- Environment variables for all secrets
- Input sanitization on all user inputs
- Post-conditions enforced on contract calls
- WalletConnect sessions properly scoped
