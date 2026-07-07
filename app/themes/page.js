"use client";

import { useState } from "react";
import {
  Palette,
  Search,
  Copy,
  Check,
  X,
  Layers,
  Layout,
  Sliders,
  DollarSign,
  Mail,
  SlidersHorizontal
} from "lucide-react";
import { LiquidGlassFilter, GlassButton } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import ToolPageShell from "@/components/ToolPageShell";
import { themes } from "@/data/themes";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "./page.module.css";

const CATEGORIES = ["All", "SaaS", "Portfolio", "E-commerce", "Creative Agency", "Web3", "Retro/Creative"];

export default function ThemesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTheme, setActiveTheme] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const { showToast } = useToast();

  const handleCopy = async (key, text, sectionLabel) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast({
        title: "Copied!",
        description: `${sectionLabel} prompt copied to clipboard.`,
        variant: "success",
      });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      showToast({
        title: "Copy Failed",
        description: "Could not write to clipboard. Please select and copy manually.",
        variant: "error",
      });
    }
  };

  const filteredThemes = themes.filter((theme) => {
    const matchesCategory =
      selectedCategory === "All" || theme.category === selectedCategory;
    const matchesSearch =
      theme.name.toLowerCase().includes(search.toLowerCase()) ||
      theme.description.toLowerCase().includes(search.toLowerCase()) ||
      theme.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <p className={styles.description}>
              Explore and copy premium design systems and animated section prompts. Drop these straight into AI builders like Lovable, Cursor, and v0 to build stunning custom websites.
            </p>

            {/* Filter controls */}
            <div className={styles.filterBar}>
              <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search themes by name, tags, or features..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.categories}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`${styles.categoryBtn} ${
                      selectedCategory === cat ? styles.categoryBtnActive : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Themes Grid */}
            <div className={styles.grid}>
              {filteredThemes.map((theme) => (
                <GlassCard key={theme.id} className={styles.card}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.themeName}>{theme.name}</h3>
                      <span className={styles.categoryBadge}>
                        {theme.category}
                      </span>
                    </div>

                    <p className={styles.themeDesc}>{theme.description}</p>

                    {/* Mock Layout Visualization */}
                    <div
                      className={styles.mockLayoutFrame}
                      style={{
                        background: theme.colors.bg,
                        borderColor: theme.colors.stroke,
                      }}
                    >
                      <div className={styles.mockNavbar}>
                        <div
                          className={styles.mockLogo}
                          style={{ background: theme.colors.primary }}
                        />
                        <div className={styles.mockNavLinks}>
                          <div
                            className={styles.mockNavLink}
                            style={{ background: theme.colors.secondary }}
                          />
                          <div
                            className={styles.mockNavLink}
                            style={{ background: theme.colors.secondary }}
                          />
                        </div>
                      </div>

                      <div className={styles.mockHero}>
                        <div
                          className={styles.mockHeroTitle}
                          style={{
                            background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                          }}
                        />
                        <div
                          className={styles.mockHeroSubtitle}
                          style={{ background: theme.colors.stroke }}
                        />
                        <div
                          className={styles.mockHeroCTA}
                          style={{ background: theme.colors.accent }}
                        />
                      </div>
                    </div>

                    {/* Specs summary */}
                    <div className={styles.specs}>
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>Fonts</span>
                        <span className={styles.specValue}>
                          {theme.fonts.heading} + {theme.fonts.body}
                        </span>
                      </div>
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>Colors</span>
                        <div className={styles.palette}>
                          <div
                            className={styles.swatch}
                            style={{ background: theme.colors.primary }}
                            title={`Primary: ${theme.colors.primary}`}
                          />
                          <div
                            className={styles.swatch}
                            style={{ background: theme.colors.secondary }}
                            title={`Secondary: ${theme.colors.secondary}`}
                          />
                          <div
                            className={styles.swatch}
                            style={{ background: theme.colors.accent }}
                            title={`Accent: ${theme.colors.accent}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.tags}>
                      {theme.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <GlassButton
                      onClick={() => setActiveTheme(theme)}
                      className={styles.exploreBtn}
                      size="lg"
                      intensity={6}
                    >
                      <Palette size={16} />
                      Get Prompts
                    </GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Prompt details drawer/modal */}
            {activeTheme && (
              <div
                className={styles.modalOverlay}
                onClick={() => setActiveTheme(null)}
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className={styles.modalHeader}>
                    <div className={styles.modalTitleArea}>
                      <h2 className={styles.modalTitle}>
                        {activeTheme.name} Presets
                      </h2>
                      <div className={styles.modalMeta}>
                        <span>Category: {activeTheme.category}</span>
                        <span>•</span>
                        <span>
                          Typography: {activeTheme.fonts.heading} /{" "}
                          {activeTheme.fonts.body}
                        </span>
                      </div>
                    </div>
                    <button
                      className={styles.closeBtn}
                      onClick={() => setActiveTheme(null)}
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className={styles.modalBody}>
                    <p className={styles.modalIntro}>
                      Copy the custom-engineered prompts below to seed your AI builder conversation. They define styling systems, motion rules, and detailed section layouts.
                    </p>

                    {/* Global Design System Prompt */}
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>
                        <div className={styles.promptTitle}>
                          <Layers size={16} />
                          <span>1. Global Design System</span>
                        </div>
                        <GlassButton
                          className={styles.copyButton}
                          size="sm"
                          intensity={4}
                          onClick={() =>
                            handleCopy(
                              `${activeTheme.id}-ds`,
                              activeTheme.prompts.designSystem,
                              "Design System"
                            )
                          }
                        >
                          {copiedKey === `${activeTheme.id}-ds` ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copiedKey === `${activeTheme.id}-ds`
                            ? "Copied"
                            : "Copy"}
                        </GlassButton>
                      </div>
                      <pre className={styles.promptPre}>
                        {activeTheme.prompts.designSystem}
                      </pre>
                    </div>

                    {/* Hero Section Prompt */}
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>
                        <div className={styles.promptTitle}>
                          <Layout size={16} />
                          <span>2. Hero Section</span>
                        </div>
                        <GlassButton
                          className={styles.copyButton}
                          size="sm"
                          intensity={4}
                          onClick={() =>
                            handleCopy(
                              `${activeTheme.id}-hero`,
                              activeTheme.prompts.hero,
                              "Hero Section"
                            )
                          }
                        >
                          {copiedKey === `${activeTheme.id}-hero` ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copiedKey === `${activeTheme.id}-hero`
                            ? "Copied"
                            : "Copy"}
                        </GlassButton>
                      </div>
                      <pre className={styles.promptPre}>
                        {activeTheme.prompts.hero}
                      </pre>
                    </div>

                    {/* Bento Grid / Features Prompt */}
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>
                        <div className={styles.promptTitle}>
                          <Sliders size={16} />
                          <span>3. Features & Grid Layout</span>
                        </div>
                        <GlassButton
                          className={styles.copyButton}
                          size="sm"
                          intensity={4}
                          onClick={() =>
                            handleCopy(
                              `${activeTheme.id}-features`,
                              activeTheme.prompts.features,
                              "Features Section"
                            )
                          }
                        >
                          {copiedKey === `${activeTheme.id}-features` ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copiedKey === `${activeTheme.id}-features`
                            ? "Copied"
                            : "Copy"}
                        </GlassButton>
                      </div>
                      <pre className={styles.promptPre}>
                        {activeTheme.prompts.features}
                      </pre>
                    </div>

                    {/* Pricing Cards Prompt */}
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>
                        <div className={styles.promptTitle}>
                          <DollarSign size={16} />
                          <span>4. Pricing Table</span>
                        </div>
                        <GlassButton
                          className={styles.copyButton}
                          size="sm"
                          intensity={4}
                          onClick={() =>
                            handleCopy(
                              `${activeTheme.id}-pricing`,
                              activeTheme.prompts.pricing,
                              "Pricing Table"
                            )
                          }
                        >
                          {copiedKey === `${activeTheme.id}-pricing` ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copiedKey === `${activeTheme.id}-pricing`
                            ? "Copied"
                            : "Copy"}
                        </GlassButton>
                      </div>
                      <pre className={styles.promptPre}>
                        {activeTheme.prompts.pricing}
                      </pre>
                    </div>

                    {/* Immersive CTA Footer Prompt */}
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>
                        <div className={styles.promptTitle}>
                          <Mail size={16} />
                          <span>5. Footer & CTA Banner</span>
                        </div>
                        <GlassButton
                          className={styles.copyButton}
                          size="sm"
                          intensity={4}
                          onClick={() =>
                            handleCopy(
                              `${activeTheme.id}-cta`,
                              activeTheme.prompts.cta,
                              "Footer & CTA"
                            )
                          }
                        >
                          {copiedKey === `${activeTheme.id}-cta` ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copiedKey === `${activeTheme.id}-cta`
                            ? "Copied"
                            : "Copy"}
                        </GlassButton>
                      </div>
                      <pre className={styles.promptPre}>
                        {activeTheme.prompts.cta}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
