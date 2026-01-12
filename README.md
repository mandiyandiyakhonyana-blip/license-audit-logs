# License Management System

## How to revoke a license:
1. Add license key to `revoked` array in `sign-revocation-list.js`
2. Run: `node sign-revocation-list.js`
3. Upload new `revoked.json` to GitHub
4. Push changes: `git add . && git commit -m "Revoke license" && git push`

## View audit logs:
- Go to Issues tab
- Filter by label: `activation`
