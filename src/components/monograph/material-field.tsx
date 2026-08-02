export function MaterialField() {
  return (
    <svg data-slot="material-field" className="material-field" viewBox="0 0 720 720" aria-hidden="true">
      <g className="material-field__orbit material-field__orbit--one">
        <ellipse cx="360" cy="360" rx="250" ry="112" />
      </g>
      <g className="material-field__orbit material-field__orbit--two">
        <ellipse cx="360" cy="360" rx="232" ry="96" transform="rotate(58 360 360)" />
      </g>
      <g className="material-field__orbit material-field__orbit--three">
        <ellipse cx="360" cy="360" rx="222" ry="88" transform="rotate(116 360 360)" />
      </g>
      <g className="material-field__lattice">
        <path d="M226 284 302 240l79 44 76-44 76 44v91l-76 44-76-44-79 44-76-44Z" />
        <path d="m302 240 79 44v91l-79 44-76-44m231-135-76 44m76 135-76-44" />
      </g>
      <g className="material-field__atoms">
        <circle cx="226" cy="284" r="10" />
        <circle cx="302" cy="240" r="13" />
        <circle cx="381" cy="284" r="9" />
        <circle cx="457" cy="240" r="12" />
        <circle cx="533" cy="284" r="9" />
        <circle cx="226" cy="375" r="12" />
        <circle cx="302" cy="419" r="9" />
        <circle cx="381" cy="375" r="14" />
        <circle cx="457" cy="419" r="9" />
        <circle cx="533" cy="375" r="12" />
      </g>
      <circle className="material-field__core" cx="381" cy="330" r="25" />
    </svg>
  )
}
