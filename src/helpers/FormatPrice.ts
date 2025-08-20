// Crear formatter una sola vez para mejor performance
const clpFormatter = new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP',
    currencyDisplay: 'code' // Muestra "CLP" en lugar de "$"
})

export const formatPrice = (price: number) => {
    return clpFormatter.format(price)
}