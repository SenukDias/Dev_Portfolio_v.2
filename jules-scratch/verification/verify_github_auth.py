from playwright.sync_api import Page, expect

def test_github_auth(page: Page):
    page.goto("http://localhost:3000")

    # Login with GitHub
    page.locator('input[aria-label="prompt"]').fill("login-github")
    page.locator('input[aria-label="prompt"]').press("Enter")

    # Wait for redirect to callback page and then to home page
    page.wait_for_url("http://localhost:3000/auth/callback**")
    page.wait_for_url("http://localhost:3000/")

    # Verify whoami
    page.locator('input[aria-label="prompt"]').fill("whoami")
    page.locator('input[aria-label="prompt"]').press("Enter")
    expect(page.locator("text=guest")).not_to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")
