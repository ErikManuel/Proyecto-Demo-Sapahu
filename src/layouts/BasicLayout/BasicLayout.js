import React from 'react';
import Head from 'next/head';
import { TopBar, Footer } from "@/components/layout";
import styles from "./BasicLayout.module.scss";

export function BasicLayout({ 
  children, 
  title = "Sistema de Cobranza de Agua", 
  description = "Gestión Municipal de Recursos Hídricos" 
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.basicLayout}>
        <TopBar />
        
        <main className={styles.layoutMain}>
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}