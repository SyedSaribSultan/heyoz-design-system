'use client';
import { useState } from 'react';
import SideNav, { SideNavItem, BrandTrigger, CommunityCard } from '@/components/SideNav';
import { APP_NAV, APP_PROFILE } from '@/components/sidenav-data';

// Live side navs for the Sidebar page: click items to make them active, toggle to collapse.
export function SideNavLive({ startCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [active, setActive] = useState('Home');
  const groups = APP_NAV.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, active: i.label === active, onClick: () => setActive(i.label) })) }));
  return (
    <div className="sd-frame" data-collapsed={collapsed || undefined}>
      <SideNav groups={groups} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}
        brand={<BrandTrigger collapsed={collapsed} />} footer={<CommunityCard collapsed={collapsed} />} profile={APP_PROFILE} />
    </div>
  );
}

// One menu item / brand picker per state, forced, for side-by-side comparison.
export function ItemStates({ collapsed }) {
  return ['default', 'hover', 'active'].map((st) => (
    <div key={st} className="sd-cell"><div className={`sd-item${collapsed ? ' sd-item-rail sn' : ' sn sd-sn'}`} data-collapsed={collapsed || undefined}>
      <SideNavItem label="Image Generator" icon="image" state={st === 'hover' ? 'hover' : undefined} active={st === 'active'} collapsed={collapsed} />
    </div><span className="type-label-lg-regular d-dim">{st}</span></div>
  ));
}
export function BrandStates({ collapsed }) {
  return ['default', 'hover'].map((st) => (
    <div key={st} className="sd-cell"><div className={`sd-item sn${collapsed ? ' sd-item-rail' : ' sd-sn'}`} data-collapsed={collapsed || undefined}>
      <BrandTrigger state={st === 'hover' ? 'hover' : undefined} collapsed={collapsed} />
    </div><span className="type-label-lg-regular d-dim">{st}</span></div>
  ));
}
