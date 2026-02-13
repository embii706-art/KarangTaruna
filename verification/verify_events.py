
from playwright.sync_api import sync_playwright

def verify_events_manual():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 812})
        page = context.new_page()

        try:
            page.goto('http://localhost:3000/#/events')
            page.wait_for_timeout(3000)
            page.screenshot(path='verification/events_manual.png')
        except Exception as e:
            print(f'Error: {e}')

        browser.close()

if __name__ == '__main__':
    verify_events_manual()
