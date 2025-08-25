import { When } from './fixture'

When('I refresh the page', async function () {
    await this.page.reload({ waitUntil: 'networkidle' })
})
