/* Inside the Machine | icons.js
   Line-art icon paths (64x64 grid) and small UI graphics. */
/* ---------- icons ---------- */
const P={
 tablet:'<rect x="14" y="6" width="36" height="52" rx="5"/><rect x="19" y="12" width="26" height="36" rx="1"/><circle cx="32" cy="53" r="1.5"/>',
 phone:'<rect x="20" y="6" width="24" height="52" rx="5"/><path d="M28 11h8"/><circle cx="32" cy="52" r="1.5"/>',
 watch:'<rect x="19" y="18" width="26" height="28" rx="7"/><path d="M24 18l2-12h12l2 12M24 46l2 12h12l2-12M32 25v7l4 3"/>',
 toaster:'<path d="M10 28a12 12 0 0 1 12-12h20a12 12 0 0 1 12 12v24H10z"/><path d="M20 16v-6a3 3 0 0 1 6 0v6M36 16v-6a3 3 0 0 1 6 0v6M54 34h5M16 44h10"/>',
 book:'<path d="M32 14c-6-4-14-5-22-4v40c8-1 16 0 22 4 6-4 14-5 22-4V10c-8-1-16 0-22 4z"/><path d="M32 14v40"/>',
 keyboard:'<rect x="5" y="20" width="54" height="26" rx="4"/><path d="M12 28h2M20 28h2M28 28h2M36 28h2M44 28h2M50 28h2M12 35h2M20 35h2M28 35h2M36 35h2M44 35h2M50 35h2M20 41h24"/>',
 mouse:'<rect x="20" y="8" width="24" height="46" rx="12"/><path d="M32 8v15"/>',
 mic:'<rect x="24" y="5" width="16" height="30" rx="8"/><path d="M16 29a16 16 0 0 0 32 0M32 45v11M24 57h16"/>',
 webcam:'<circle cx="32" cy="26" r="17"/><circle cx="32" cy="26" r="6"/><path d="M32 43v10M21 56h22"/>',
 monitor:'<rect x="5" y="8" width="54" height="36" rx="3"/><path d="M32 44v9M20 57h24"/>',
 printer:'<path d="M18 24V8h28v16"/><rect x="7" y="24" width="50" height="20" rx="3"/><path d="M18 38h28v18H18zM24 46h16M24 51h10"/>',
 speakers:'<rect x="16" y="5" width="32" height="54" rx="4"/><circle cx="32" cy="38" r="10"/><circle cx="32" cy="17" r="4"/>',
 headphones:'<path d="M12 38v-6a20 20 0 0 1 40 0v6"/><rect x="7" y="36" width="11" height="19" rx="3"/><rect x="46" y="36" width="11" height="19" rx="3"/>',
 router:'<rect x="7" y="36" width="50" height="17" rx="4"/><path d="M18 36l-6-24M46 36l6-24M16 45h2M24 45h2M32 45h2"/>',
 cable:'<path d="M12 50c14 0 8-22 20-22s8-16 20-16"/><rect x="4" y="44" width="10" height="13" rx="2"/><rect x="50" y="6" width="10" height="13" rx="2"/>',
 modem:'<rect x="10" y="26" width="44" height="26" rx="5"/><path d="M18 44h2M26 44h2M34 44h2M22 18a14 14 0 0 1 20 0M26 12a8 8 0 0 0 0 0"/><path d="M17 12a22 22 0 0 1 30 0"/>',
 mb:'<rect x="8" y="8" width="48" height="48" rx="3"/><rect x="18" y="18" width="15" height="15"/><path d="M42 14v22M48 14v22M14 46h36M14 40h18"/>',
 ram:'<rect x="5" y="20" width="54" height="20" rx="2"/><path d="M12 27h6v6h-6zM23 27h6v6h-6zM34 27h6v6h-6zM45 27h6v6h-6zM9 46h46"/>',
 psu:'<rect x="5" y="14" width="54" height="36" rx="3"/><circle cx="24" cy="32" r="11"/><path d="M24 21v22M13 32h22M42 25h9M42 32h9M42 39h9"/>',
 hdd:'<rect x="10" y="7" width="44" height="50" rx="4"/><circle cx="32" cy="27" r="12"/><circle cx="32" cy="27" r="3"/><path d="M39 47l10-8"/>',
 fan:'<circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="4"/><path d="M32 28c0-10 8-15 13-10M36 32c10 0 15 8 10 13M32 36c0 10-8 15-13 10M28 32c-10 0-15-8-10-13"/>',
 gpu:'<rect x="4" y="16" width="56" height="28" rx="3"/><circle cx="22" cy="30" r="8"/><circle cx="42" cy="30" r="8"/><path d="M9 44v7h22v-7"/>'
};
const ico=k=>`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;
const CHIP='<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="12" width="24" height="24" rx="3" fill="#FFC21A"/><path d="M18 5v7M24 5v7M30 5v7M18 36v7M24 36v7M30 36v7M5 18h7M5 24h7M5 30h7M36 18h7M36 24h7M36 30h7" stroke="#B86A22" stroke-width="3.5" stroke-linecap="round"/></svg>';
const AVATAR='<svg viewBox="0 0 104 104" aria-hidden="true"><circle cx="52" cy="52" r="50" fill="var(--panel-2)" stroke="var(--line)" stroke-width="2"/><path d="M20 94c4-18 17-28 32-28s28 10 32 28" fill="var(--pcb)"/><circle cx="52" cy="42" r="19" fill="var(--trace)"/><rect x="33" y="34" width="38" height="12" rx="6" fill="var(--xray)"/><circle cx="43" cy="40" r="3" fill="#fff"/><circle cx="61" cy="40" r="3" fill="#fff"/><rect x="44" y="76" width="16" height="10" rx="2" fill="var(--led)"/></svg>';
const SCANNER='<svg viewBox="0 0 84 84" aria-hidden="true"><circle cx="34" cy="34" r="24" fill="rgba(29,95,168,.16)" stroke="currentColor" stroke-width="5"/><circle cx="34" cy="34" r="3" fill="currentColor"/><path d="M52 52l24 24" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>';
