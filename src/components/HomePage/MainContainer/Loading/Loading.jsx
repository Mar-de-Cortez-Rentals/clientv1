import './Loading.css';

function Loading(props) {
	return (
		<div className='Loading'>
			{props.reason && <div className='errorMessage'></div>}
			<svg
				width='778'
				height='769'
				viewBox='0 0 778 769'
				preserveAspectRatio='xMidYMid meet'
				xmlns='http://www.w3.org/2000/svg'
				style={{ cursor: 'pointer' }}
			>
				<g id='LogoApp'>
					<g id='logo-lines'>
						<path
							id='line1'
							d='M177.86 452.773C171.579 436.254 153.095 427.954 136.576 434.235C120.057 440.516 111.757 458.999 118.038 475.519C124.319 492.038 142.802 500.338 159.322 494.057C175.841 487.776 184.141 469.293 177.86 452.773ZM356.557 378.41L145.816 458.538L150.081 469.754L360.822 389.627L356.557 378.41Z'
						/>
						<path
							id='line2'
							d='M613.604 77.3253C599.288 66.9618 579.282 70.1656 568.918 84.4812C558.555 98.7968 561.759 118.803 576.074 129.167C590.39 139.53 610.396 136.326 620.76 122.011C631.123 107.695 627.92 87.6888 613.604 77.3253ZM589.979 99.7276L401.976 359.424L411.697 366.461L599.699 106.764L589.979 99.7276Z'
						/>
						<path
							id='line3'
							d='M643.219 595.795C654.456 582.154 652.507 561.987 638.866 550.75C625.225 539.513 605.058 541.462 593.821 555.103C582.584 568.744 584.533 588.912 598.174 600.148C611.815 611.385 631.983 609.436 643.219 595.795ZM622.335 570.818L407.529 393.871L399.899 403.133L614.705 580.08L622.335 570.818Z'
						/>
					</g>
					<g id='Text-Logo'>
						<text
							transform='translate(91.9153 324.78)'
							fontSize='128'
							fontWeight='500'
							letterSpacing='0em'
						>
							<tspan x='0' y='87.888'>
								Carg
							</tspan>
							<tspan x='330.375' y='87.888'>
								ndo...{' '}
							</tspan>
						</text>
						<text
							transform='translate(91.9153 324.78)'
							fontSize='128'
							fontWeight='500'
							letterSpacing='0em'
						>
							<tspan x='258.5' y='87.888' id='o'>
								a
							</tspan>
						</text>
					</g>
				</g>
			</svg>
		</div>
	);
}

export default Loading;
