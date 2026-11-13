'use client';
import { useState } from 'react';
import SideNav, { CommunityCard } from '@/components/SideNav';
import { APP_NAV, APP_PROFILE } from '@/components/sidenav-data';
import { BrandPicker } from './Menus';

// The Home screen's side nav: the shared SideNav, collapsible, with the live brand menu.
export default function HomeSideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Home');
  const groups = APP_NAV.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, active: i.label === active, onClick: () => setActive(i.label) })) }));
  return (
    <div className="sidenav">
      <SideNav groups={groups} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} shortcut logoHref="/home"
        brand={<BrandPicker collapsed={collapsed} />} footer={<CommunityCard collapsed={collapsed} />} profile={APP_PROFILE} />
    </div>
  );
}
