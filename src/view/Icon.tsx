import React, { MouseEvent } from "react"

import styl from "./Icon.scss"

interface Props {
  name: string
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  className?: string
}

export function Icon({
  name,
  onClick,
  className = onClick ? styl.iconClickable : styl.icon,
}: Props) {
  return (
    <div className={className} onClick={onClick}>
      <i className="material-icons">{name}</i>
    </div>
  )
}
