"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ExternalLink, Copy, Tag } from 'lucide-react';

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOffers() {
            // Fetch courses that serve as offers
            const { data } = await supabase.from('courses').select('*').order('id', { ascending: false });
            if (data) setOffers(data);
            setLoading(false);
        }
        fetchOffers();
    }, []);

    const copyLink = (id: number) => {
        const link = `${window.location.origin}/offer/${id}`;
        navigator.clipboard.writeText(link);
        alert('Link copiado: ' + link);
    };

    return (
        <div style={{ color: '#1a1a1a' }}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Ofertas Ativas</h1>
                    <p className="text-gray-500">Gerencie os links de venda e campanhas dos seus produtos.</p>
                </div>
            </div>

            {loading ? (
                <p>Carregando ofertas...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                            <tr>
                                <th className="p-4 font-medium">Produto / Curso</th>
                                <th className="p-4 font-medium">Categoria</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden shrink-0">
                                                <img src={offer.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-900">{offer.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Tag size={14} />
                                            {offer.category || 'Geral'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/offer/${offer.id}`} target="_blank" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                <ExternalLink size={14} /> Ver Página
                                            </Link>
                                            <button
                                                onClick={() => copyLink(offer.id)}
                                                className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                                                title="Copiar Link"
                                            >
                                                <Copy size={14} /> Copiar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
