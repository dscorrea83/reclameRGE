import React, { useState } from 'react';
import { ExternalLink, BookOpen, ShieldCheck, Lock } from 'lucide-react';
import { BlogLogo } from './BlogLogo';
import { MetodologiaModal } from './MetodologiaModal';
import { BASE_TARIFARIA_DATA_ATUALIZACAO } from '../utils/calculator';

export const Footer: React.FC = () => {
  const [isMetodologiaOpen, setIsMetodologiaOpen] = useState(false);

  return (
    <>
      <footer id="footer-section" className="bg-[#1a3a5f] text-white py-10 mt-12 border-t border-blue-950">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-center gap-3">
            <BlogLogo size="sm" />
            <div className="text-left sm:text-center">
              <h3 className="font-bold text-base text-white leading-tight">Taquara em Foco</h3>
              <p className="text-xs text-amber-300">Cidadão-Pesquisador Atento</p>
            </div>
          </div>

          {/* Social / Blog Links Section */}
          <div className="bg-blue-950/60 border border-blue-800/60 rounded-2xl p-5 max-w-3xl mx-auto shadow-inner">
            <p className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-3">
              Acompanhe nosso Blog nas redes:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Facebook */}
              <a
                id="btn-link-facebook"
                href="https://www.facebook.com/taquaraemfoco/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1877F2]/90 hover:bg-[#1877F2] text-white text-xs font-semibold shadow transition-all duration-150 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3 opacity-70 ml-auto sm:ml-0" />
              </a>

              {/* Instagram */}
              <a
                id="btn-link-instagram"
                href="https://www.instagram.com/taquaraemfoco/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-semibold shadow transition-all duration-150 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 opacity-70 ml-auto sm:ml-0" />
              </a>

              {/* Substack */}
              <a
                id="btn-link-substack"
                href="https://taquaraemfoco.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#FF6719] hover:bg-[#ff5500] text-white text-xs font-semibold shadow transition-all duration-150 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                title="Artigos completos e aprofundados"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11L22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
                <span className="truncate">Substack (Artigos)</span>
                <ExternalLink className="w-3 h-3 opacity-70 ml-auto sm:ml-0 flex-shrink-0" />
              </a>
            </div>

            <p className="text-[11px] text-blue-300/80 mt-2.5">
              📖 Acesse o <strong>Substack</strong> para ler as análises aprofundadas sobre a prestação de serviços de energia na região.
            </p>
          </div>

          {/* Links de Transparência e Metodologia */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setIsMetodologiaOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Metodologia e Bases Tarifárias (Atualizado: {BASE_TARIFARIA_DATA_ATUALIZACAO})</span>
            </button>

            <a
              href="https://www.radiotaquara.com.br/novo/procon-de-taquara-notifica-rge-sobre-aumentos-nas-contas-de-luz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Notícia: Procon de Taquara notifica RGE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Informational and Legal Notice */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-blue-200">
            <span>Serviço cidadão de triagem e utilidade pública</span>
            <span>•</span>
            <span className="text-amber-300">Sem vínculo institucional com o Procon ou com a concessionária RGE</span>
          </div>

          <p className="text-xs text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
            Esta plataforma é um instrumento de triagem preliminar, conferência e organização prévia de documentos para munícipes de Taquara e região. Não possui efeito vinculante, não constitui laudo pericial e não substitui a análise da concessionária ou dos órgãos oficiais de defesa do consumidor.
          </p>
        </div>
      </footer>

      <MetodologiaModal
        isOpen={isMetodologiaOpen}
        onClose={() => setIsMetodologiaOpen(false)}
      />
    </>
  );
};
