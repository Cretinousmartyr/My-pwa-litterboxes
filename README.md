# My-pwa-litterboxes
# Litter Box Tracker PWA with NFC Deep-Linking

This Progressive Web App (PWA) tracks maintenance for six litter boxes over a 42-day calendar (14 days before to 28 days after today). You can mark days as "scooped" or "cleaned" (with cleaning automatically counting as scooped for 48 hours), and you can rename each litter box via an inline pencil edit button.

**New Feature – NFC Deep-Linking:**  
Instead of manually pressing a button, each NFC tag is programmed with a URL such as:

https://your-username.github.io/litter-box-tracker/?nfcBox=3

https://github.com/your-username/litter-box-tracker.git

When you scan the tag with your NFC-enabled smartphone, the URL opens your PWA, which automatically marks today as scooped for the specified litter box (in this example, box 3), without any extra steps.

## Features

- **6 Calendars:** One per litter box (42-day view).
- **Editable Names:** Click the pencil icon to rename a litter box.
- **Status Tracking:** Mark a day as scooped or cleaned (cleaning auto-marks the next 2 days as scooped).
- **Push Notifications:** Checks every minute for overdue tasks and sends alerts.
- **PWA Capabilities:** Installable, offline support via manifest and service worker.
- **NFC Deep-Linking:** Scan an NFC tag to automatically mark a litter box as scooped.

## How to Upload to GitHub Pages

1. **Create a New Repository:**
   - Log in to GitHub.
   - Click the "+" icon (upper right) and select "New repository."
   - Name the repository (e.g., `litter-box-tracker`), choose "Public," then click "Create repository."

2. **Clone the Repository Locally:**
   ```bash
   git clone https://github.com/your-username/litter-box-tracker.git
   cd litter-box-tracker

   ---

## Final Notes

- **NFC Deep-Linking:**  
  This method relies on each NFC tag containing a deep-link URL. When scanned, the phone’s NFC reader automatically opens the URL in the browser. The app then detects the `nfcBox` query parameter and marks today as scooped for that box without any extra button presses.
- **Browser Support:**  
  Note that Web NFC is not available in all browsers; however, deep-linking via URL works universally.
- **Push Notifications:**  
  The sample uses local notifications via the Notification API. For a production setup, you might integrate a backend push service.

By following these files and instructions, you’ll have a fully functional PWA with NFC deep-linking that meets your requirements—no extra steps needed after scanning an NFC tag!

Let me know if you need any further modifications or additional features.
