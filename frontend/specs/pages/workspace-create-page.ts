import type { Page } from '@playwright/test'

export class WorkspaceCreatePage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/workspace/new')

    private workspaceTitleLocator = () => this.page.locator('#workspace-title')
    enterWorkspaceName = (title: string) => this.workspaceTitleLocator().fill(title)
    workspaceTitleValue = () => this.workspaceTitleLocator().inputValue()

    submit = () => this.page.locator('button[type="submit"]').click()

    errorMessage = () => this.page.textContent('#error-message')
}
