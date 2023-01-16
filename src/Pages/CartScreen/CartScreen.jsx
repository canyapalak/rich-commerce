import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AverageAnnualIncome from '../../components/CheckoutStats/AverageAnnualIncome'
import NetworthImpacts from '../../components/CheckoutStats/NetworthImpacts'
import OrderSummary from '../../components/CheckoutStats/OrderSummary'
import { CartContext } from '../../context/CartContext'
import { PlayerContext } from '../../context/PlayerContext'
import { RedirectContext } from '../../context/RedirectContext'

const CartScreen = () => {
  const { cart, setCart, cartCount } = useContext(CartContext)
  const { player } = useContext(PlayerContext)
  const { setPath } = useContext(RedirectContext)

  const [summaryTotal, setSummaryTotal] = useState(0)
  const [discount, setDiscount] = useState(0)

  //annual income section
  const [yearsToAffordCart, setYearsToAffordCart] = useState(0)
  const [annualIncome, setAnnualIncome] = useState(38426) //germany to initialize

  useEffect(() => {
    getSemitotals()
    getDiscounts()
  }, [cartCount])

  const getSemitotals = () => {
    let total = 0
    cart.map(({ item }) => {
      return (total = total + item.price)
    })
    return total
  }

  const getDiscounts = () => {
    // console.log('cartCount', cartCount)
    switch (true) {
      case cartCount === 1: {
        setDiscount(0.1)
        break
      }
      case cartCount > 1 && cartCount < 3: {
        setDiscount(0.2)
        break
      }
      case cartCount >= 3 && cartCount < 6: {
        setDiscount(0.3)
        break
      }
      case cartCount > 6: {
        setDiscount(0.4)
        break
      }

      default:
        setDiscount(0)
    }
  }

  const getTotals = () => {
    return getSemitotals() - getSemitotals() * discount
  }

  const getPlayerNetworth = () => {
    if (!player) return
    const initialMoney = player.estWorthPrev
    // console.log('initialMoney', initialMoney)
    const moneyParts = initialMoney.toString()
    // console.log('moneyParts', moneyParts)
    const networth = moneyParts.replace('.', '')
    // console.log('networth', +networth)
    return +networth
  }

  const getBudgetTotal = (fn) => {
    return Math.floor((getTotals() * 100) / fn)
  }

  const getYearsToCart = (income) => {
    return Math.floor(getTotals() / income)
  }

  const handleRemove = (item) => {
    const newCart = cart.filter(
      (cartItem) => cartItem.item.product_id !== item.product_id
    )

    setCart(newCart)
  }

  return (
    <main
      className={` grid grid-cols-1 lg:block animate__animated animate__fadeIn ${
        cart.length > 0
          ? 'h-full lg:h-[81%]'
          : 'h-full lg:h-[80.9%] flex justify-center items-center'
      } `}
    >
      {cart.length > 0 && player ? (
        <div className='grid grid-cols-1 lg:gap-0 lg:flex h-full'>
          <div className='bg-gray-300/20 dark:bg-black/70 w-full lg:w-2/3 h-full overflow-auto p-2 lg:p-4 rounded'>
            <div className='h-[250px] lg:h-full overflow-auto  col-span-2 flex flex-col gap-5'>
              {cart.map(({ item }, i) => (
                <div
                  key={i}
                  className={`flex  ${
                    i % 2 === 0
                      ? 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 dark:from-gray-700/50 dark:to-slate-500/50'
                      : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 dark:from-gray-700/50 dark:to-violet-400/40'
                  } rounded`}
                >
                  <div className='lg:max-w-[250px] p-2'>
                    <img
                      src={item.img}
                      alt={item.name}
                      className='w-[200px] object-cover lg:h-full lg:w-full rounded'
                    />
                  </div>
                  <div className='flex flex-col py-1 relative w-full'>
                    <h3 className='font-semibold uppercase text-sm md:text-lg'>
                      {item.name}
                    </h3>
                    {/* <p className=' max-w-[300px] text-ellipsis'>{item.desc}</p> */}
                    <button
                      onClick={() => handleRemove(item)}
                      className=' absolute right-3 bottom-0 lg:bottom-[75%] duration-200 hover:scale-125 p-0'
                    >
                      <i className='fa-solid fa-delete-left text-red-600 dark:text-gray-200 text-2xl '></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='w-full lg:w-1/3 overflow-auto h-[500px] lg:h-full'>
            <div className='bg-gray-300 dark:bg-transparent p-4 rounded'>
              <div className='bg-gray-800 dark:bg-gray-700/50 py-3 px-4 rounded w-full flex justify-between items-center'>
                <h2 className='text-gray-200'>CHECKOUT</h2>
                <i className='fa-solid fa-wallet text-gray-200 text-2xl'></i>
              </div>
              <span className='text-end'>
                Get ready to break the bank, because your cart is loaded with
                items that will cost you a pretty penny ({getSemitotals()}$ to
                be exact). But don't worry, you'll be saving a small fortune by
                purchasing another item and we will give you a tasty discount!.
              </span>
              <OrderSummary
                cartCount={cartCount}
                getSemitotals={getSemitotals}
                discount={discount}
                getTotals={getTotals}
              />
              <NetworthImpacts
                name={player.personName}
                getBudgetTotal={getBudgetTotal}
                getPlayerNetworth={getPlayerNetworth}
                getTotals={getTotals}
              />
              <AverageAnnualIncome
                annualIncome={annualIncome}
                getBudgetTotal={getBudgetTotal}
                getTotals={getTotals}
                getYearsToCart={getYearsToCart}
                setAnnualIncome={setAnnualIncome}
              />
              <h2 className='mt-8 font-semibold text-gray-800'>
                GDP to {player.personName} Budget in %
              </h2>
              <div className='flex flex-col gap-y-3 divide-y-2 divide-gray-400 bg-white dark:bg-gray-700/50 p-4 rounded'>
                <span className='flex justify-between'>
                  <span>Annual income per capita</span>
                  <span>{annualIncome}</span>
                </span>
                <span className='flex justify-between'>
                  <span>Germany</span>
                  <span>0.13</span>
                </span>
                <span className='flex justify-between'>
                  <span>United States</span>
                  <span>0.09</span>
                </span>
                <span className='flex justify-between'>
                  <span>Spain</span>
                  <span>0.40</span>
                </span>
                <span className='flex justify-between'>
                  <span>Argentina</span>
                  <span>0.65</span>
                </span>
                <span className='flex justify-between items-center'>
                  <span>Laos</span>
                  <span>gdp under budget</span>
                </span>
                <span className='flex justify-between items-center'>
                  <span className='font-semibold'>
                    All of the above combined
                  </span>
                  <span className='text-red-600 bg-red-100 px-3 py-1 rounded font-medium'>
                    0.8
                  </span>
                </span>
              </div>
              <h2 className='mt-8 font-semibold text-gray-800'>
                How many people are needed to match 1 {player.personName}{' '}
                networth?
              </h2>
              <div className='flex flex-col gap-y-3 divide-y-2 divide-gray-400 bg-white dark:bg-gray-700/50 p-4 rounded'>
                <span className='flex justify-between'>
                  <span>Germany</span>
                  <span>670.000 persons</span>
                </span>
                <span className='flex justify-between'>
                  <span>United States</span>
                  <span>430.000 persons</span>
                </span>
                <span className='flex justify-between'>
                  <span>Spain</span>
                  <span>4.230.504 persons</span>
                </span>
                <span className='flex justify-between'>
                  <span>Argentina</span>
                  <span>22.004.324 persons</span>
                </span>
                <span className='flex justify-between items-center'>
                  <span>Laos</span>
                  <span>Persons needed over population</span>
                </span>
                <span className='flex justify-between items-center'>
                  <span className='font-semibold'>
                    All of the above combined
                  </span>
                  <span className='text-red-600 bg-red-100 px-3 py-1 rounded font-medium'>
                    543.004.324 persons
                  </span>
                </span>
              </div>
              <div className='bg-white p-4 mt-8 cursor-pointer rounded'>
                <div className='flex justify-start gap-3 items-center'>
                  <h3>PROMO CODE</h3>
                  <i className='fa-solid fa-money-bill-wave text-xl text-green-700'></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : cart.length > 0 && !player ? (
        <div className='pt-[50%] md:pt-[20%] animate__animated animate__tada flex flex-col gap-y-5 items-center lg:text-6xl  rounded-lg'>
          <div className='flex items-center gap-2'>
            <span>You must choose a player!</span>
            <i className='fa-regular fa-face-frown text-gray-700 dark:text-gray-300'></i>
          </div>
          <Link
            onClick={() => setPath('/cart')}
            to='/characters'
            className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-md'
          >
            Choose Player now!
          </Link>
        </div>
      ) : (
        <div className='animate__animated animate__tada flex flex-col gap-y-5 items-center lg:text-6xl  rounded-lg'>
          <div className='flex items-center gap-2'>
            <span>Your Cart is Empty</span>
            <i className='fa-regular fa-face-frown text-gray-700 dark:text-gray-300'></i>
          </div>
          <Link
            onClick={() => setPath('/cart')}
            to='/categories'
            className='bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-md'
          >
            Shop now!
          </Link>
        </div>
      )}
    </main>
  )
}

export default CartScreen
