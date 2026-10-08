import { unknownIcon } from '../../rendering-util/icons.js';
import type { IconifyJSON } from '@iconify/types';

const wrapIcon = (icon: string) => {
  return `<g><rect width="80" height="80" style="fill: #087ebf; stroke-width: 0px;"/>${icon}</g>`;
};

export const architectureIcons: IconifyJSON = {
  prefix: 'mermaid-architecture',
  height: 80,
  width: 80,
  icons: {
    database: {
      body: wrapIcon(
        '<path id="b" data-name="4" d="m20,57.86c0,3.94,8.95,7.14,20,7.14s20-3.2,20-7.14" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><path id="c" data-name="3" d="m20,45.95c0,3.94,8.95,7.14,20,7.14s20-3.2,20-7.14" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><path id="d" data-name="2" d="m20,34.05c0,3.94,8.95,7.14,20,7.14s20-3.2,20-7.14" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse id="e" data-name="1" cx="40" cy="22.14" rx="20" ry="7.14" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="20" y1="57.86" x2="20" y2="22.14" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="60" y1="57.86" x2="60" y2="22.14" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/>'
      ),
    },
    server: {
      body: wrapIcon(
        '<rect x="17.5" y="17.5" width="45" height="45" rx="2" ry="2" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="17.5" y1="32.5" x2="62.5" y2="32.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="17.5" y1="47.5" x2="62.5" y2="47.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><g><path d="m56.25,25c0,.27-.45.5-1,.5h-10.5c-.55,0-1-.23-1-.5s.45-.5,1-.5h10.5c.55,0,1,.23,1,.5Z" style="fill: #fff; stroke-width: 0px;"/><path d="m56.25,25c0,.27-.45.5-1,.5h-10.5c-.55,0-1-.23-1-.5s.45-.5,1-.5h10.5c.55,0,1,.23,1,.5Z" style="fill: none; stroke: #fff; stroke-miterlimit: 10;"/></g><g><path d="m56.25,40c0,.27-.45.5-1,.5h-10.5c-.55,0-1-.23-1-.5s.45-.5,1-.5h10.5c.55,0,1,.23,1,.5Z" style="fill: #fff; stroke-width: 0px;"/><path d="m56.25,40c0,.27-.45.5-1,.5h-10.5c-.55,0-1-.23-1-.5s.45-.5,1-.5h10.5c.55,0,1,.23,1,.5Z" style="fill: none; stroke: #fff; stroke-miterlimit: 10;"/></g><g><path d="m56.25,55c0,.27-.45.5-1,.5h-10.5c-.55,0-1-.23-1-.5s.45-.5,1-.5h10.5c.55,0,1,.23,1,.5Z" style="fill: #fff; stroke-width: 0px;"/><path d="m56.25,55c0,.27-.45.5-1,.5h-10.5c-.55,0-1-.23-1-.5s.45-.5,1-.5h10.5c.55,0,1,.23,1,.5Z" style="fill: none; stroke: #fff; stroke-miterlimit: 10;"/></g><g><circle cx="32.5" cy="25" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/><circle cx="27.5" cy="25" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/><circle cx="22.5" cy="25" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/></g><g><circle cx="32.5" cy="40" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/><circle cx="27.5" cy="40" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/><circle cx="22.5" cy="40" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/></g><g><circle cx="32.5" cy="55" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/><circle cx="27.5" cy="55" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/><circle cx="22.5" cy="55" r=".75" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10;"/></g>'
      ),
    },
    disk: {
      body: wrapIcon(
        '<rect x="20" y="15" width="40" height="50" rx="1" ry="1" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse cx="24" cy="19.17" rx=".8" ry=".83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse cx="56" cy="19.17" rx=".8" ry=".83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse cx="24" cy="60.83" rx=".8" ry=".83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse cx="56" cy="60.83" rx=".8" ry=".83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse cx="40" cy="33.75" rx="14" ry="14.58" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><ellipse cx="40" cy="33.75" rx="4" ry="4.17" style="fill: #fff; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><path d="m37.51,42.52l-4.83,13.22c-.26.71-1.1,1.02-1.76.64l-4.18-2.42c-.66-.38-.81-1.26-.33-1.84l9.01-10.8c.88-1.05,2.56-.08,2.09,1.2Z" style="fill: #fff; stroke-width: 0px;"/>'
      ),
    },
    internet: {
      body: wrapIcon(
        '<circle cx="40" cy="40" r="22.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="40" y1="17.5" x2="40" y2="62.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="17.5" y1="40" x2="62.5" y2="40" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><path d="m39.99,17.51c-15.28,11.1-15.28,33.88,0,44.98" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><path d="m40.01,17.51c15.28,11.1,15.28,33.88,0,44.98" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="19.75" y1="30.1" x2="60.25" y2="30.1" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="19.75" y1="49.9" x2="60.25" y2="49.9" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/>'
      ),
    },
    cloud: {
      body: wrapIcon(
        '<path d="m65,47.5c0,2.76-2.24,5-5,5H20c-2.76,0-5-2.24-5-5,0-1.87,1.03-3.51,2.56-4.36-.04-.21-.06-.42-.06-.64,0-2.6,2.48-4.74,5.65-4.97,1.65-4.51,6.34-7.76,11.85-7.76.86,0,1.69.08,2.5.23,2.09-1.57,4.69-2.5,7.5-2.5,6.1,0,11.19,4.38,12.28,10.17,2.14.56,3.72,2.51,3.72,4.83,0,.03,0,.07-.01.1,2.29.46,4.01,2.48,4.01,4.9Z" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/>'
      ),
    },
    client: {
      body: wrapIcon(
        '<rect x="17.5" y="20" width="45" height="30" rx="2" ry="2" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="40" y1="50" x2="40" y2="58" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="30" y1="60" x2="50" y2="60" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/>'
      ),
    },
    router: {
      body: wrapIcon(
        '<rect x="15" y="42.5" width="50" height="17.5" rx="3" ry="3" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="25" y1="42.5" x2="21" y2="22" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><line x1="55" y1="42.5" x2="59" y2="22" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><circle cx="23.5" cy="51.25" r="1.75" style="fill: #fff; stroke-width: 0px;"/><circle cx="30.5" cy="51.25" r="1.75" style="fill: #fff; stroke-width: 0px;"/><circle cx="37.5" cy="51.25" r="1.75" style="fill: #fff; stroke-width: 0px;"/><line x1="47" y1="51.25" x2="57" y2="51.25" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/>'
      ),
    },
    firewall: {
      body: wrapIcon(
        '<rect x="17.5" y="22.5" width="45" height="35" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="17.5" y1="34.17" x2="62.5" y2="34.17" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="17.5" y1="45.83" x2="62.5" y2="45.83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="32.5" y1="22.5" x2="32.5" y2="34.17" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="47.5" y1="22.5" x2="47.5" y2="34.17" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="25" y1="34.17" x2="25" y2="45.83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="40" y1="34.17" x2="40" y2="45.83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="55" y1="34.17" x2="55" y2="45.83" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="32.5" y1="45.83" x2="32.5" y2="57.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="47.5" y1="45.83" x2="47.5" y2="57.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/>'
      ),
    },
    gateway: {
      body: wrapIcon(
        '<path d="M25,62.5V35a15,15 0 0 1 30,0V62.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="15" y1="47.5" x2="65" y2="47.5" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><polyline points="20,42.5 15,47.5 20,52.5" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><polyline points="60,42.5 65,47.5 60,52.5" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/>'
      ),
    },
    wifi: {
      body: wrapIcon(
        '<path d="M32.93,49.93A10,10 0 0 1 47.07,49.93" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><path d="M25.86,42.86A20,20 0 0 1 54.14,42.86" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><path d="M18.79,35.79A30,30 0 0 1 61.21,35.79" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/><circle cx="40" cy="57" r="3.5" style="fill: #fff; stroke-width: 0px;"/>'
      ),
    },
    queue: {
      body: wrapIcon(
        '<rect x="15" y="27.5" width="50" height="25" rx="4" ry="4" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><rect x="21" y="32.5" width="8" height="15" rx="1" ry="1" style="fill: #fff; stroke-width: 0px;"/><rect x="33" y="32.5" width="8" height="15" rx="1" ry="1" style="fill: #fff; stroke-width: 0px;"/><rect x="45" y="32.5" width="8" height="15" rx="1" ry="1" style="fill: #fff; stroke-width: 0px;"/><polyline points="57,36 61,40 57,44" style="fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;"/>'
      ),
    },
    loadbalancer: {
      body: wrapIcon(
        '<circle cx="40" cy="22.5" r="5" style="fill: #fff; stroke-width: 0px;"/><circle cx="20" cy="57.5" r="5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><circle cx="40" cy="57.5" r="5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><circle cx="60" cy="57.5" r="5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="40" y1="27.5" x2="40" y2="52.5" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="37.5" y1="26.83" x2="22.5" y2="53.17" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/><line x1="42.5" y1="26.83" x2="57.5" y2="53.17" style="fill: none; stroke: #fff; stroke-miterlimit: 10; stroke-width: 2px;"/>'
      ),
    },
    unknown: unknownIcon,
    blank: {
      body: wrapIcon(''),
    },
  },
};
