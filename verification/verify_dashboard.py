
from playwright.sync_api import sync_playwright

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device
        context = browser.new_context(viewport={'width': 375, 'height': 812}, device_scale_factor=3)
        page = context.new_page()

        # Navigate to Dashboard - PORT 3000
        page.goto("http://localhost:3000/#/dashboard")

        # Wait for content to load
        page.wait_for_timeout(3000)

        # Take screenshot
        page.screenshot(path="verification/dashboard_redesign.png")

        # Also take a screenshot of Finance page to verify "rb" removal
        page.goto("http://localhost:3000/#/finance")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/finance_redesign.png")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
