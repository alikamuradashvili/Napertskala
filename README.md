# ნაპერწკალა / Napertskala

ორენოვანი (ქართული და ინგლისური) მომსახურების ვებსაიტი შედუღების, ელექტრო მომსახურების, აგრეგატებისა და ავტო დიაგნოსტიკისთვის. პროექტში შედის დაცული Admin Panel, მომხმარებლის როლები, ტექსტების მართვა და სურათების ატვირთვა.

Bilingual Georgian/English service website for welding, electrical work, generators and basic car diagnostics. The project includes a protected Admin Panel, administrator roles, editable content and image uploads.

## სწრაფი გაშვება Windows CMD-დან

1. გახსენით **Command Prompt**.
2. ჩაწერეთ:

```cmd
cd /d C:\Users\alika\Desktop\Napertskala\Napertskala
start-site.cmd
```

3. დაელოდეთ შეტყობინებას, რომ საიტი გაეშვა.
4. ბრაუზერში გახსენით: http://localhost:3000
5. სერვერის გასაჩერებლად Command Prompt-ში დააჭირეთ `Ctrl+C`.

`start-site.cmd` ავტომატურად იპოვის ჩვეულებრივ Node.js/pnpm ინსტალაციას. თუ ისინი PATH-ში არ არის, launcher გამოიყენებს Codex-ის bundled runtime-ს ამ კომპიუტერზე.

## Manual start from Windows CMD

Fastest method:

```cmd
cd /d C:\Users\alika\Desktop\Napertskala\Napertskala
start-site.cmd
```

Open http://localhost:3000 and keep the Command Prompt window running. Press `Ctrl+C` to stop the server.

### Standard pnpm commands

If Node.js 22+ and pnpm are installed globally:

```cmd
cd /d C:\Users\alika\Desktop\Napertskala\Napertskala\site
pnpm install
pnpm run dev
```

Then open http://localhost:3000.

## Launcher commands

Run these from the main `Napertskala` folder:

```cmd
start-site.cmd            REM Start development server
start-site.cmd install    REM Install dependencies
start-site.cmd build      REM Create production build
start-site.cmd check      REM Check TypeScript
start-site.cmd restart    REM Stop the current server and start a fresh one
start-site.cmd public     REM Listen on the home network for direct domain access
start-site.cmd stop       REM Stop the running server
```

If `start-site.cmd` finds that Napertskala is already running, it now prints the existing URL and exits successfully. This is normal—only one development server should run for the same project.

## დომენის პირდაპირ ამ კომპიუტერზე მიბმა (Cloudflare-ის გარეშე)

`localhost` DNS-ში ვერ ჩაიწერება: ის ყოველთვის მხოლოდ იმავე მოწყობილობას ნიშნავს. `napertskala.ge` უნდა მიუთითებდეს თქვენი სახლის ინტერნეტის **საჯარო IPv4** მისამართზე, ხოლო როუტერმა მოთხოვნა ამ კომპიუტერზე უნდა გადმოაგზავნოს.

### 1. საიტის საჯარო რეჟიმში გაშვება

Command Prompt-ში გაუშვით:

```cmd
cd /d C:\Users\alika\Desktop\Napertskala\Napertskala
start-public-site.cmd
```

ეს რეჟიმი საიტს `0.0.0.0:3000`-ზე ასმენინებს. CMD-ის ფანჯარა ღია უნდა დარჩეს. საიტი და დომენი იმუშავებს მხოლოდ მაშინ, როცა კომპიუტერი, პროგრამა, როუტერი და ინტერნეტი ჩართულია.

### 2. კომპიუტერის შიდა IP მისამართი

CMD-ში გაუშვით `ipconfig` და იპოვეთ აქტიური Wi-Fi/Ethernet-ის **IPv4 Address**, მაგალითად `192.168.1.50`. როუტერში ამ კომპიუტერს გაუკეთეთ DHCP Reservation/Static Lease, რომ ეს მისამართი არ შეიცვალოს.

### 3. როუტერის Port Forwarding

როუტერის მართვის გვერდზე შექმენით ერთი წესი:

- Protocol: `TCP`
- External/WAN port: `80`
- Internal/LAN IP: ამ კომპიუტერის IPv4, მაგალითად `192.168.1.50`
- Internal port: `3000`
- Status: `Enabled`

Windows Firewall-შიც საჭიროა შემომავალი TCP `3000` პორტის დაშვება. ეს არის Windows-ის სისტემური ცვლილება და ცალკე უნდა გაკეთდეს მხოლოდ თქვენი თანხმობით.

### 4. Domenebi.ge DNS ჩანაწერები

დომენის DNS მართვაში ჩაწერეთ:

| Type | Host/Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | თქვენი საჯარო IPv4 | `300` ან Auto |
| `A` | `www` | იგივე საჯარო IPv4 | `300` ან Auto |

`www`-სთვის მეორე `A` ჩანაწერის ნაცვლად შეიძლება `CNAME` გამოიყენოთ: `www` → `napertskala.ge`. წაშალეთ მხოლოდ ის parking/redirect ჩანაწერი, რომელიც ამავე `@` ან `www` სახელზე ეწინააღმდეგება ახალ ჩანაწერს.

### 5. საჯარო IPv4 / CGNAT შემოწმება

შეადარეთ როუტერის Internet/WAN IPv4 თქვენს საჯარო IP-ს. თუ როუტერის WAN მისამართი იწყება `10.*`, `100.64.*`–`100.127.*`, `172.16.*`–`172.31.*` ან `192.168.*`, სავარაუდოდ პროვაიდერის CGNAT-ზე ხართ. ასეთ შემთხვევაში პირდაპირი შემოსული კავშირი ვერ იმუშავებს და პროვაიდერს უნდა სთხოვოთ **public IPv4** (სასურველია static IPv4).

ტესტი ჩაატარეთ ტელეფონის მობილური ინტერნეტით და არა იმავე Wi-Fi-დან: გახსენით `http://napertskala.ge`. ზოგიერთ როუტერს საკუთარი საჯარო მისამართის იმავე Wi-Fi-დან გახსნა არ შეუძლია (NAT loopback).

### უსაფრთხოების მნიშვნელოვანი შეზღუდვა

ეს პირდაპირი ვარიანტი არის ჩვეულებრივი `HTTP`, არა `HTTPS`. ადმინისტრატორის პაროლი და სესია ინტერნეტში დაშიფვრის გარეშე გადაიცემა, ამიტომ საჯარო HTTP მისამართიდან Admin Panel-ში შესვლა არ არის უსაფრთხო. ასევე Google OAuth ჩვეულებრივ დომენზე დაუშიფრავ `http://napertskala.ge/...` callback-ს არ იღებს — Google-ით შესვლა იმუშავებს მხოლოდ `localhost`-ზე, სანამ დომენზე HTTPS არ დაემატება. ელფოსტა/პაროლით შესვლა ტექნიკურად იმუშავებს, მაგრამ საჯარო HTTP-ზე მის გამოყენებას არ გირჩევთ.

## Admin Panel

Sign in: http://localhost:3000/login
Protected panel: http://localhost:3000/admin

- Public pages show **Log in**, not an administrator link. Only signed-in, active Admin or Super Admin accounts see the panel link.
- Direct access to `/admin` redirects signed-out visitors to `/login`. Protected API actions also verify the account's role.
- Ordinary visitors and unknown Google accounts cannot create an administrator account.
- For the first owner account only, run the following in CMD from the project folder:

```bat
setup-admin.cmd
start-site.cmd restart
```

Open http://localhost:3000/setup and enter the private key printed by `setup-admin.cmd`, then choose your own email and password (at least 10 characters). The helper stores the key in ignored `site/.env.local` and preserves your other settings. Never share this key or commit this file. After successful setup, remove `ADMIN_SETUP_TOKEN` from `site/.env.local` and restart. Setup is automatically closed once an account exists. For a separately hosted installation, configure its own `ADMIN_SETUP_TOKEN` as a server-side secret; do not upload your local environment file.

- Initial password setup requires a valid private setup key. Google sign-in works only for an account already added by the owner.
- The last active Super Admin cannot be deleted, disabled or demoted.
- A Super Admin can create User, Admin or Super Admin accounts.
- Admins can edit Georgian and English text, phone, Facebook, work hours and location.
- Admins can upload images and select the active logo or hero image.
- Google sign-in requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### Users / მომხმარებლები

Open http://localhost:3000/admin/users after signing in as a Super Admin, or click **Users** in the admin sidebar. The page supports Georgian and English; use its **EN / ქარ** button to switch.

1. Click **Add user** to create an account using a password or an approved Google email. New accounts default to the regular **User** role; no invitation email is sent automatically.
2. Find the account by name or email. You can filter the list by role or account status.
3. To promote someone, choose **Admin** under **Role**, click **Save changes**, and confirm. Choose **User** to remove admin access.
4. Choose **Disabled** under **Status** to block sign-in, or **Active** to restore it. Role/status changes end that user's existing sessions, so they must sign in again.
5. Deleting an account requires confirmation. Its uploaded photos and website content are kept, but its login and sessions are removed.

Regular Users can sign in to the public site but cannot enter the admin panel. Admins can manage content and photos but cannot view the Users directory or change accounts. Only Super Admins can manage users. Your own role/status cannot be changed here, and the last active Super Admin is also protected at database level.

სუპერ ადმინის ანგარიშით გახსენით **Users / მომხმარებლები**. მომხმარებლის ადმინისტრატორად დანიშვნისთვის აირჩიეთ **ადმინისტრატორი**, დააჭირეთ **ცვლილებების შენახვას** და დაადასტურეთ. **გამორთული** სტატუსი კრძალავს შესვლას, **აქტიური** კი აღადგენს წვდომას. ბოლო აქტიური სუპერ ადმინის წაშლა, გამორთვა ან დაქვეითება შეუძლებელია.

Existing accounts, credentials, sessions and uploaded-content references are preserved by the automatic local schema upgrade. The matching saved migration is `site/drizzle/0002_daffy_jack_power.sql`. To run isolated security and migration checks without changing your real accounts, run `pnpm run test:auth` from `site`.

For local Google OAuth configuration, add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `SITE_ORIGIN` from `site/.env.example` to `site/.env.local`; preserve any existing setup key or settings. Use `http://localhost:3000/api/auth/google/callback` as the local redirect URI. Do not overwrite an existing environment file.

### Set up Google sign-in / Google-ით შესვლა

Google sign-in needs your own Google OAuth credentials. The website code alone cannot create these credentials. Until configured, use your site's email/password login (not your Gmail password).

1. Open [Google Cloud Console](https://console.cloud.google.com/) in Chrome or Edge. Select or create a project for Napertskala.
2. Open **Google Auth Platform**. Complete the branding/consent setup with the Napertskala name and your contact email. For personal Gmail accounts choose an **External** audience. During testing, add your Google account as a test user if the console requires it.
3. In **Clients**, select **Create client → Web application**. Use `Napertskala local` as its name.
4. Add the exact **Authorized redirect URI** below (no trailing slash):

```text
http://localhost:3000/api/auth/google/callback
```

5. Create the client and download its JSON immediately. Keep this file private and outside the project, especially outside `site/public`. Do not send the Client Secret in chat. Google may not let you view or download the secret again later.
6. Run these commands in **PowerShell**, pressing Enter after each line:

```powershell
cd "C:\Users\alika\Desktop\Napertskala\Napertskala"
.\setup-google.cmd
```

When prompted, paste the path to your downloaded JSON file. The helper validates the Web client and callback address, then saves only the three Google settings into ignored `site/.env.local`. Existing accounts, passwords and unrelated settings are preserved. It does not send data online, create a Google project, or automatically restart the website.

```powershell
.\setup-google.cmd --check
.\start-site.cmd restart
```

Open http://localhost:3000/login in Chrome or Edge and select **Continue with Google**. Use `alikamuradashvili23@gmail.com` for your existing Super Admin account. Other Google emails must first be added by a Super Admin under **Users**; Google sign-in never grants admin permission automatically.

For **CMD**, use `cd /d C:\Users\alika\Desktop\Napertskala\Napertskala`, then `setup-google.cmd` and `start-site.cmd restart`. PowerShell does not accept `cd /d` and needs the `.\` prefix to launch a script from the current folder.

If Google reports `redirect_uri_mismatch`, check the exact callback URI in Google Cloud. If it reports `disallowed_useragent`, use a normal Chrome or Edge window instead of an embedded browser. A successful `--check` confirms settings are present, not that Google has accepted them; a real sign-in is the final check.

Google-ით შესვლისთვის Google Cloud-ში შექმენით **Web application** კლიენტი და ჩამოტვირთეთ მისი JSON ფაილი. გაუშვით `setup-google.cmd` და მიუთითეთ ფაილის მისამართი. საიტის გადატვირთვის შემდეგ შედით Google-ით იმავე ელფოსტით, რომელიც მომხმარებლებში უკვე დამატებულია. Client Secret არავის გაუზიაროთ.

Official references: [Google OAuth web-server setup](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred), [Manage Google OAuth clients](https://support.google.com/cloud/answer/15549257).

## Project structure

```text
Napertskala/
├── README.md              Project instructions
├── start-site.cmd         Windows CMD launcher
├── setup-admin.cmd        Private first-owner setup helper
├── setup-google.cmd       Private local Google sign-in setup
└── site/
    ├── app/               Website, Admin Panel and API routes
    ├── components/        Reusable interface components
    ├── db/                Database schema
    ├── drizzle/           Database migrations
    ├── lib/               Authentication and server helpers
    ├── public/            Logo and public assets
    └── package.json       Project commands and dependencies
```

## Main technologies

- TypeScript and React
- Vinext and Tailwind CSS
- Cloudflare D1 database
- Cloudflare R2 image storage
- Drizzle database migrations

## Production build

```cmd
cd /d C:\Users\alika\Desktop\Napertskala\Napertskala
start-site.cmd build
```

The production output is created in `site/dist`.

## Live site

Private deployed version: https://napertskala-services.smuradash1.chatgpt.site

### Run the public domain from this computer

Cloudflare Tunnel connects both `https://napertskala.ge` and
`https://www.napertskala.ge` to the website running on this computer. In CMD:

```cmd
cd /d C:\Users\alika\Desktop\Napertskala\Napertskala
start-online-site.cmd
```

Keep the website and Cloudflare Tunnel windows open while the public site is in
use. Closing the computer, disconnecting its internet, or closing either process
makes the public site unavailable.

The launcher starts two watchdog windows. If the website or Tunnel process exits
unexpectedly, its watchdog waits five seconds and starts it again. The Tunnel
uses HTTP/2 over TCP because it is more reliable than QUIC on this connection,
and uses Cloudflare's `1.1.1.1:53` and `1.0.0.1:53` resolvers instead of relying
on an unresponsive local DNS resolver. It starts only after the local website
returns a successful response. This prevents temporary Cloudflare 502 errors
while the site is still starting and DNS timeout errors while discovering the
Tunnel edge.

The domain's Google OAuth client must include these values:

```text
Authorized JavaScript origin: https://napertskala.ge
Authorized redirect URI: https://napertskala.ge/api/auth/google/callback
```

## Troubleshooting

### Port 3000 is already in use

Another copy of the site may already be running. Find its Command Prompt window and press `Ctrl+C`, then run `start-site.cmd` again.

You can also restart it directly:

```cmd
start-site.cmd restart
```

### Node or pnpm is not found

Use `start-site.cmd` from the main project folder. If the bundled runtime is later removed, install Node.js 22+ and pnpm, then reopen Command Prompt.

### Dependencies are missing

```cmd
start-site.cmd install
start-site.cmd
```
