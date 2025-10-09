import { When } from './fixture'

When('I refresh the page', async function () {
    await this.page.reload({ waitUntil: 'networkidle' })
})

When('I follow the copied URL', async function () {
    const copiedURL: string = await this.page.evaluate(
        // @ts-ignore - navigator is a browser API
        () => navigator.clipboard.readText(),
    )
    console.log('copiedURL', `'${copiedURL}'`)
    await this.page.goto(copiedURL)
})
