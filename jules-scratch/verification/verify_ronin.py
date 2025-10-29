from playwright.sync_api import Page, expect

def test_ronin_command(page: Page):
    page.goto("http://localhost:3000")

    page.fill('input[aria-label="prompt"]', 'ronin what is the meaning of life?')
    page.press('input[aria-label="prompt"]', 'Enter')

    expect(page.locator('text=Error: Could not connect to the AI service.')).to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")
