import { classnames } from 'tailwindcss-classnames';

export const inputBase = classnames('appearance-none', 'relative', 'block', 'w-full', 'px-3', 'py-3', 'border', 'border-gray-300', 'placeholder-gray-500', 'text-gray-900', 'rounded-md', 'focus:outline-none', 'focus:z-10', 'sm:text-sm');

export const inputMain = classnames(inputBase, 'focus:ring-indigo-500', 'focus:border-indigo-500');

export const inputError = classnames(inputBase, 'border-red-400', 'focus:ring-red-500', 'focus:border-red-500');