/**
 * Shared inline style constants for components that require inline styles.
 *
 * All values use CSS custom properties so they automatically respond to theme changes.
 * This file is the ONLY acceptable source for inline style objects containing colors.
 *
 * IMPORTANT: These are CSSProperties objects compatible with React's style prop.
 */

import type { CSSProperties } from "react";

export const inlineStyles = {
  // ── INPUT FIELD ──
  input: {
    width: "100%",
    height: "40px",
    padding: "0 12px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "var(--foreground)",
    background: "var(--background)",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color var(--duration-normal) var(--ease-standard)",
  } as CSSProperties,

  inputWithLeftIcon: {
    width: "100%",
    height: "40px",
    padding: "0 12px 0 34px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "var(--foreground)",
    background: "var(--background)",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color var(--duration-normal) var(--ease-standard)",
  } as CSSProperties,

  // ── LABEL ──
  label: {
    display: "block",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "var(--foreground)",
    marginBottom: "6px",
  } as CSSProperties,

  // ── SECTION CARD ──
  sectionCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "22px 24px",
    boxShadow: "var(--shadow-sm)",
  } as CSSProperties,

  // ── SECTION HEADER ──
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--foreground)",
    margin: "0 0 4px",
  } as CSSProperties,

  sectionDesc: {
    fontSize: "12.5px",
    color: "var(--muted-foreground)",
    margin: "0 0 16px",
  } as CSSProperties,

  divider: {
    border: "none",
    borderTop: "1px solid var(--border-subtle)",
    margin: "0 0 16px",
  } as CSSProperties,

  // ── DATA TABLE ──
  tableContainer: {
    background: "var(--card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
  } as CSSProperties,

  tableHeaderRow: {
    borderBottom: "1px solid var(--border-subtle)",
  } as CSSProperties,

  tableHeaderCell: {
    padding: "11px 16px",
    textAlign: "left" as const,
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    color: "var(--muted-foreground)",
    whiteSpace: "nowrap" as const,
    background: "var(--card)",
  } as CSSProperties,

  tableHeaderCellRight: {
    padding: "11px 16px",
    textAlign: "right" as const,
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    color: "var(--muted-foreground)",
    whiteSpace: "nowrap" as const,
    background: "var(--card)",
  } as CSSProperties,

  tableCell: {
    padding: "12px 16px",
    color: "var(--foreground)",
  } as CSSProperties,

  tableCellMuted: {
    padding: "12px 16px",
    color: "var(--muted-foreground)",
    whiteSpace: "nowrap" as const,
    fontSize: "13px",
  } as CSSProperties,

  tableEmptyCell: {
    padding: "48px 16px",
    textAlign: "center" as const,
    color: "var(--muted-foreground)",
    fontSize: "14px",
  } as CSSProperties,

  // ── PAGINATION ──
  paginationBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: "1px solid var(--border-subtle)",
    flexWrap: "wrap" as const,
    gap: "8px",
  } as CSSProperties,

  paginationText: {
    fontSize: "13px",
    color: "var(--muted-foreground)",
  } as CSSProperties,

  paginationBtn: {
    height: "30px",
    padding: "0 10px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: "13px",
    color: "var(--foreground)",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background-color var(--duration-fast) var(--ease-standard)",
  } as CSSProperties,

  paginationBtnActive: {
    height: "30px",
    width: "30px",
    borderRadius: "6px",
    border: "none",
    background: "var(--primary)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--primary-foreground)",
    cursor: "pointer",
  } as CSSProperties,

  paginationBtnDisabled: {
    height: "30px",
    padding: "0 10px",
    borderRadius: "6px",
    border: "1px solid var(--border-subtle)",
    background: "var(--card)",
    fontSize: "13px",
    color: "var(--text-disabled)",
    cursor: "not-allowed",
    fontWeight: 500,
  } as CSSProperties,

  // ── SEARCH INPUT ──
  searchWrapper: {
    position: "relative" as const,
    flex: "1",
    maxWidth: "320px",
  } as CSSProperties,

  searchInput: {
    width: "100%",
    height: "36px",
    padding: "0 12px 0 36px",
    border: "1px solid var(--border)",
    borderRadius: "7px",
    fontSize: "13.5px",
    color: "var(--foreground)",
    background: "var(--card)",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color var(--duration-normal) var(--ease-standard)",
  } as CSSProperties,

  searchIcon: {
    position: "absolute" as const,
    left: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "15px",
    height: "15px",
    color: "var(--muted-foreground)",
    pointerEvents: "none" as const,
  } as CSSProperties,

  // ── TOOLBAR BUTTONS ──
  filterButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "36px",
    padding: "0 14px",
    border: "1px solid var(--border)",
    borderRadius: "7px",
    background: "var(--card)",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "var(--foreground)",
    cursor: "pointer",
    transition: "background-color var(--duration-fast) var(--ease-standard)",
  } as CSSProperties,

  addButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "36px",
    padding: "0 16px",
    border: "none",
    borderRadius: "7px",
    background: "var(--primary)",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "var(--primary-foreground)",
    cursor: "pointer",
    transition: "opacity var(--duration-fast) var(--ease-standard)",
  } as CSSProperties,

  // ── PROFILE PHOTO SECTION ──
  photoSectionCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
  } as CSSProperties,

  coverArea: {
    width: "100%",
    height: "160px",
    overflow: "hidden",
  } as CSSProperties,

  coverGradient: {
    width: "100%",
    height: "160px",
    background:
      "linear-gradient(135deg, oklch(0.25 0.12 265) 0%, var(--primary) 60%, oklch(0.70 0.15 265) 100%)",
    overflow: "hidden",
  } as CSSProperties,

  avatarOverlay: {
    position: "absolute" as const,
    bottom: "-36px",
    left: "20px",
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    border: "3px solid var(--background)",
    overflow: "hidden",
    background: "var(--muted)",
    boxShadow: "var(--shadow-md)",
  } as CSSProperties,

  coverEditButton: {
    position: "absolute" as const,
    top: "10px",
    right: "10px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "color-mix(in oklch, var(--background) 90%, transparent)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  } as CSSProperties,

  // ── CV SECTION ──
  cvSectionCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "var(--shadow-sm)",
  } as CSSProperties,

  cvFileCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    background: "var(--surface-1)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
  } as CSSProperties,

  cvIconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    background: "color-mix(in oklch, var(--destructive) 12%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as CSSProperties,
} as const;
