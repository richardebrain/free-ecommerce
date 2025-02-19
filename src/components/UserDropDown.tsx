import { useUserStores } from '@/contexts/UserProvider'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid'
import type { BaseModel, UserModel } from '@jaclight/dbsdk'
import { PlusGridItem } from './plus-grid'

export default function UserDropdown({ user }: { user: BaseModel<UserModel> }) {
  const { signOut } = useUserStores((state) => state)
  const handleLogout = async () => {
    await signOut()
    console.log('User logged out')
  }

  return (
    <div className="relative max-sm:hidden">
      <Menu>
        <PlusGridItem className="relative flex">
          <MenuButton className="inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none">
            <UserCircleIcon className="size-6" />
            <p>Hi {user && (user?.data?.name as any).split(' ')[0]}</p>
            <ChevronDownIcon className="size-4" />
          </MenuButton>
        </PlusGridItem>

        <MenuItems
          transition
          anchor="bottom end"
          className="mt-2 w-40 origin-top-right rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-lg focus:outline-none"
        >
          <MenuItem>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-red-600 ${
                  active ? 'bg-red-50' : ''
                }`}
              >
                <ArrowRightOnRectangleIcon className="size-5 text-red-500" />
                Logout
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}
