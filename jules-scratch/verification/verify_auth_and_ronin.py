from playwright.sync_api import Page, expect

def test_auth_and_ronin(page: Page):
    page.goto("http://localhost:3000")

    # Login
    page.locator('input[aria-label="prompt"]').fill("login testuser")
    page.locator('input[aria-label="prompt"]').press("Enter")

    # Verify whoami
    page.locator('input[aria-label="prompt"]').fill("whoami")
    page.locator('input[aria-label="prompt"]').press("Enter")
    expect(page.locator("text=testuser")).to_be_visible()

    # Verify ronin
    page.locator('input[aria-label="prompt"]').fill("ronin test")
    page.locator('input[aria-label="prompt"]').press("Enter")
    expect(page.locator("text=.------.")).to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")
