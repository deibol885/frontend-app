import { animated, useSpring } from '@react-spring/web'
import { THEMES_POSITIONS } from '../../utils/constants'
interface ICircularProgressProps {
  color: string
  percentage: number
  children: JSX.Element
  size: string
  thickness: string
  subtheme: number | null
}
function CircularProgress({
  color,
  percentage,
  children,
  size,
  thickness,
  subtheme,
}: ICircularProgressProps): JSX.Element {
  let classes = 'bg-neutral radial-progress transition-all z-10 '

  let style = {
    '--value': percentage,
    '--size': size,
    '--thickness': thickness,
    transition: 'transform 1s ease-in-out',
  } as React.CSSProperties

  if (subtheme !== null) {
    const { x, y } = THEMES_POSITIONS[subtheme]
    console.log('x, y: ', x, y)
    const springs = useSpring({
      from: { transform: 'translate(0,0)' },
      to: { transform: `translate(${x}%, ${y}%)` },
    })

    style.position = 'absolute'
    style.zIndex = 9
    Object.assign(style, springs)
  }

  switch (color) {
    case 'purpose':
      classes += 'text-purpose'
      break
    case 'people':
      classes += 'text-people'
      break
    case 'profit':
      classes += 'text-profit'
      break
    case 'planet':
      classes += 'text-planet'
      break
    case 'negative':
      classes += 'text-error'
      break
    case 'positive':
    default:
      classes += 'text-success'
  }

  return (
    <animated.div className={classes} style={style}>
      {children}
    </animated.div>
  )
}

CircularProgress.defaultProps = {
  size: '7rem',
  thickness: '1rem',
  subtheme: null,
}

export default CircularProgress