// Store details — address and hours are still placeholders
export const STORE = {
  name: 'Phantom',
  fullName: 'Phantom Store',
  phone: '+92 326 2853106', // shown on the site
  whatsapp: '923262853106', // digits only, with country code, for wa.me links
  email: 'gamerhaiderbayek@gmail.com',
  address: 'Your shop address, City',
  hours: 'Mon – Sat, 10:00 AM – 9:00 PM',
}

export const PRODUCT = {
  name: 'PlayStation®5 Console',
  shortName: 'PS5 Console',
  price: 500,
  currency: 'USD',
  maxPerOrder: 3,
}

// Files in /public, resolved against the deploy base (works under a sub-folder like GitHub Pages)
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: PRODUCT.currency,
    maximumFractionDigits: 0,
  }).format(amount)
