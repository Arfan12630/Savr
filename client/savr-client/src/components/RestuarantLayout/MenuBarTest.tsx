import Apps from '@mui/icons-material/Apps';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Menu, { menuClasses } from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import Sheet from '@mui/joy/Sheet';
import * as React from 'react';
interface MenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  menu: React.ReactElement<any>;
  open: boolean;
  onOpen: (
    event?:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  onLeaveMenu: (callback: () => boolean) => void;
  label: string;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: ({ placement }: any) => {
        if (placement.includes('end')) {
          return [8, 20];
        }
        return [-8, 20];
      },
    },
  },
];

function NavMenuButton({
  children,
  menu,
  open,
  onOpen,
  onLeaveMenu,
  label,
  ...props
}: Omit<MenuButtonProps, 'color'>) {
  const isOnButton = React.useRef(false);
  const internalOpen = React.useRef(open);

  const handleButtonKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    internalOpen.current = open;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      onOpen(event);
    }
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={(_, isOpen) => {
        if (isOpen) {
          onOpen?.();
        }
      }}>
      <MenuButton
        {...props}
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
        onMouseDown={() => {
          internalOpen.current = open;
        }}
        onClick={() => {
          if (!internalOpen.current) {
            onOpen();
          }
        }}
        onMouseEnter={() => {
          onOpen();
          isOnButton.current = true;
        }}
        onMouseLeave={() => {
          isOnButton.current = false;
        }}
        onKeyDown={handleButtonKeyDown}
        sx={[
          {
            '&:focus-visible': {
              bgcolor: 'neutral.plainHoverBg',
            },
          },
          open ? { bgcolor: 'neutral.plainHoverBg' } : { bgcolor: null },
        ]}>
        {children}
      </MenuButton>
      {React.cloneElement(menu, {
        onMouseLeave: () => {
          onLeaveMenu(() => isOnButton.current);
        },
        modifiers,
        slotProps: {
          listbox: {
            id: `nav-example-menu-${label}`,
            'aria-label': label,
          },
        },
        placement: 'right-start',
        sx: {
          width: 288,
          [`& .${menuClasses.listbox}`]: {
            '--List-padding': 'var(--ListDivider-gap)',
          },
        },
      })}
    </Dropdown>
  );
}

export default function MenuIconSideNavExample() {
  const [menuIndex, setMenuIndex] = React.useState<null | number>(null);

  const createHandleLeaveMenu =
    (index: number) => (getIsOnButton: () => boolean) => {
      setTimeout(() => {
        const isOnButton = getIsOnButton();
        if (!isOnButton) {
          setMenuIndex((latestIndex: null | number) => {
            if (index === latestIndex) {
              return null;
            }
            return latestIndex;
          });
        }
      }, 200);
    };
  return (
    <Sheet sx={{ borderRadius: 'sm', py: 1, mr: 20 }}>
      <List>
        <ListItem>
          <NavMenuButton
            label="Apps"
            open={menuIndex === 0}
            onOpen={() => setMenuIndex(0)}
            onLeaveMenu={createHandleLeaveMenu(0)}
            menu={
              <Menu
                onClose={() => setMenuIndex(null)}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2, // optional spacing between items
                  p: 1, // padding
                  border: '1px solid #ccc',
                  borderRadius: 'md',
                  bgcolor: 'background.body',
                }}>
                <ul
                  style={{
                    listStyleType: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    padding: 1,

                    borderRadius: 'md',
                  }}>
                  <li>
                    <CropSquareIcon />{' '}
                  </li>
                  <li>
                    <CropSquareIcon />{' '}
                  </li>
                </ul>
              </Menu>
            }>
            <Apps />
          </NavMenuButton>
        </ListItem>
      </List>
    </Sheet>
  );
}
