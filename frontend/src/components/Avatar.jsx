export default function Avatar({ src, name = '?', size = 44 }) {
  const style = { width: size, height: size, fontSize: size * 0.45 }
  if (src) return <img className="avatar" src={src} alt={name} style={style} />
  return (
    <div className="avatar avatar-fallback" style={style}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}