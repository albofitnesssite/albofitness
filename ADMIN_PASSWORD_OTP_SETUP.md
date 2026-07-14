# ALBO Admin Password Recovery OTP Setup

The frontend now uses the secure Supabase Auth recovery flow:

1. Admin enters the registered Supabase Auth email.
2. `resetPasswordForEmail()` requests a recovery email.
3. The admin enters the OTP from that email.
4. `verifyOtp({ type: 'recovery' })` creates a verified recovery session.
5. `updateUser({ password })` updates the password in Supabase Auth.
6. The app signs out and asks the admin to log in with the new password.

## REQUIRED: change the Supabase recovery email template to show the OTP

Open:

Supabase Dashboard > Authentication > Email Templates > Reset Password

Use a recovery email body that includes the Supabase token variable:

```html
<h2>ALBO FITNESS ADMIN</h2>
<p>Your password recovery OTP is:</p>
<h1>{{ .Token }}</h1>
<p>Enter this code only on the ALBO admin recovery screen.</p>
<p>If you did not request this, ignore this email.</p>
```

Do not remove the `{{ .Token }}` variable. The React recovery screen expects the numeric recovery OTP.

## Registered admin email

Create/manage the real admin account in:

Supabase Dashboard > Authentication > Users

The password is owned by Supabase Auth. After a verified recovery OTP, `supabase.auth.updateUser({ password: newPassword })` changes the password in the Supabase Auth user record.

## Security note

The reset screen intentionally does not publicly confirm whether a random email is registered. This prevents account/email enumeration. Supabase handles whether the recovery email is sent to the Auth user.

For production, configure Supabase Auth SMTP with the gym-owned domain/mail provider so recovery emails are branded and deliver reliably.
