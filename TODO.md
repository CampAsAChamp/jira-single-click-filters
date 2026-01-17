# TODO Items

## Future Enhancements

### Additional URL Pattern Support
**Priority:** Low  
**Status:** Future consideration

**Description:**
The extension currently supports common Jira URL patterns:
- `*.atlassian.net` (Atlassian Cloud)
- `*/jira/*` (Self-hosted with /jira path)
- `jira.*` (Jira subdomains)

Some organizations may use unusual URL patterns (e.g., `mycompany.com/tracker`, `mycompany.com/projects`). 

**Potential Solutions:**
1. Add more patterns to manifest.json
2. Implement a custom URL configuration feature (requires optional_host_permissions)
3. Document limitations and suggest URL structure best practices

**Notes:**
- Current patterns should cover 95%+ of Jira installations
- More specific patterns provide better security and performance
- Custom URL feature was previously implemented but removed for simplicity in v1.0
