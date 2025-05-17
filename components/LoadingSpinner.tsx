import { twMerge } from "tailwind-merge"

export function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={twMerge(
        `
          pointer-events-none
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-4xl
          opacity-0
          transition-all
        `,
        isLoading && "opacity-100"
      )}
    >
      <div className="animate-spin">
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
