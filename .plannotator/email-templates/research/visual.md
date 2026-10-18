# Email visual research (partial)

## Observed (source code read)
- React Email Linear login code (resend/react-email apps/demo/emails/Community/magic-links/linear-login-code.tsx): container max 560px, logo 42px, h1 24px weight 400, button 15px/600 padding 11x23, "valid 5 minutes" sentence, code in inline <code> 21px mono on #dfe1e4, Hr then plain text link footer in #b4becc 14px. No address, no legal text.
- Plaid verify (magic-links/plaid-verify-identity.tsx): 360px bordered card, 11px uppercase blue eyebrow "Verify Your Identity", 20px heading, code 32px bold letter-spacing 6px on rgba(0,0,0,.05) box 280px wide, 15px/23px text "Not expecting this email? Contact login@plaid.com".
- emailcn auth-otp-default (https://emailcn.run/r/react-email/block-auth-otp-default.json): container 600px p-8, heading 20px medium, body 16px muted, code 32px mono bold tracking 8px, one <span> per digit, on muted bg rounded-md px-8 py-6, "expires in N minutes", "ignore if you did not request". No button, no footer.
- emailcn receipt-stripe: heading 30px bold "Invoice", subline "{orderNumber} . {name}", Row/Column label-left value-right, Hr, total 18px bold, one line "Need help? Contact support".
- Apple receipt (receipts/apple-receipt.tsx): 660px; label 10px grey (#666) over value 12px, in a #fafafa rounded table with white 1px cell borders; right-aligned total; Hr above and below.
- emailcn default theme: 600px, 14px base, 1.6 line height, border #e5e7eb, button 14px/500 padding 12x24 radius 6. No dark-mode code found in the blocks read (inferred: dark mode is ours to add).
## Really Good Emails
Category page listed 50 of 536 emails (Ally denial, Monzo get started, Medium login code, Bilt rent processing, Wave new sign-in, Sonos verify, Delta check-in, Uber receipt). Individual emails render as images/iframes: layouts were not readable by fetch. Not observed.
