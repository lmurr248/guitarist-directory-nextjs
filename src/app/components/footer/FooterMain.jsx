"use client";

import Image from "next/image";
import * as React from "react";

const FooterMain = () => {
  const logoBlue = "/gtnm-logo-blue.svg";

  return (
    <footer>
      <Image
        src={logoBlue}
        alt="GTNM Logo White"
        width={120}
        height={50}
      ></Image>
    </footer>
  );
};

export default FooterMain;
