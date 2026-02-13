from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    base_url = "http://localhost:3000/#"

    try:
        print("Navigating to Dashboard...")
        page.goto(f"{base_url}/dashboard")
        page.wait_for_selector("text=Ongoing Projects", timeout=10000)

        # Test 1: Click Finance Card
        print("Testing Finance Card Navigation...")
        page.click("text=Finance")
        page.wait_for_timeout(1000)
        if "/finance" in page.url:
            print("PASS: Finance navigation working.")
        else:
            print(f"FAIL: Finance navigation failed. URL: {page.url}")

        # Go back
        page.goto(f"{base_url}/dashboard")
        page.wait_for_selector("text=Ongoing Projects")

        # Test 2: Click Dashboard/Stats Card
        print("Testing Dashboard/Stats Card Navigation...")
        # Finding the card might be tricky as it has "Dashboard" text which is also in the header sometimes?
        # But the header says "Hi Member".
        # The card says "Dashboard" and "Overview".
        # Let's click "Overview" to be safe.
        page.click("text=Overview")
        page.wait_for_timeout(1000)
        if "/reports" in page.url:
            print("PASS: Reports navigation working.")
        else:
            print(f"FAIL: Reports navigation failed. URL: {page.url}")

        # Go back
        page.goto(f"{base_url}/dashboard")
        page.wait_for_selector("text=Ongoing Projects")

        # Test 3: Search Functionality
        print("Testing Search Filtering...")
        # Initially Finance should be visible
        if page.is_visible("text=Finance"):
            print("Initial state: Finance card visible.")

        # Type "Event" (Assuming there are events or empty state? If empty, nothing happens)
        # Type "Dashboard" -> Finance should disappear
        page.fill("input[placeholder='Search projects...']", "Dashboard")
        page.wait_for_timeout(500)

        if not page.is_visible("text=Finance"):
             print("PASS: Search filtered out Finance card.")
        else:
             print("FAIL: Finance card still visible after searching 'Dashboard'.")

        if page.is_visible("text=Overview"):
             print("PASS: Dashboard card visible after searching 'Dashboard'.")
        else:
             print("FAIL: Dashboard card hidden after searching 'Dashboard'.")

        # Clear search
        page.fill("input[placeholder='Search projects...']", "")
        page.wait_for_timeout(500)

        # Test 4: Center Floating Button
        print("Testing Center Floating Button...")
        # It's a button with a Plus icon. We can look for the button element in the fixed container.
        # It has classes `w-14 h-14 bg-[#1e293b]`.
        # Or just use CSS selector.
        # Using a safer selector: look for the button inside the fixed container, or by the Plus icon
        page.click("div.fixed button")
        page.wait_for_timeout(1000)
        if "/events" in page.url:
             print("PASS: Center button navigation working.")
        else:
             print(f"FAIL: Center button navigation failed. URL: {page.url}")

    except Exception as e:
        print(f"Error: {e}")
        # Take a screenshot for debugging
        page.screenshot(path="verification/error_debug.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
