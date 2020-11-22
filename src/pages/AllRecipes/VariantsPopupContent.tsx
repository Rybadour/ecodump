import React from 'react';

export default ({ variants }: { variants: string[] }) => (
    <div>
        {variants.map((t, i) => <p key={i}>{t}</p>)}
    </div>
)