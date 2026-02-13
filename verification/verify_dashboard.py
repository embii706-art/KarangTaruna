from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Go to Dashboard (Assuming port 5173 and HashRouter)
    # Using HashRouter, so paths are /#/dashboard
    # Access is enabled via publicPaths hack in App.tsx
    try:
        page.goto("http://localhost:3000/#/dashboard")
        page.wait_for_timeout(5000) # Wait for load and animations

        # Take screenshot
        page.screenshot(path="verification/dashboard_layout.png", full_page=True)
        print("Screenshot taken successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
