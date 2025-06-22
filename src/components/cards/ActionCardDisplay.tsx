// src/components/cards/ActionCardDisplay.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActionCard } from '@/types/chat';

interface ActionCardDisplayProps {
    card: ActionCard;
}

export default function ActionCardDisplay({ card }: ActionCardDisplayProps) {
    // Determine badge color based on confidence level
    const getBadgeVariant = (confidence: number): "default" | "secondary" | "destructive" => {
        if (confidence >= 0.8) return "default";
        if (confidence >= 0.5) return "secondary";
        return "destructive";
    };

    return (
        <Card className="mb-4 bg-white hover:shadow-hover transition-all duration-200 border-2 border-cascala-gray-200">
            <CardHeader className="p-6 pb-4 border-b border-cascala-gray-100">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-cascala-gray-900 mb-2">
                            {card.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-cascala-gray-600 font-medium">
                            Patient: {card.patient}
                        </CardDescription>
                    </div>
                    {card.confidence !== undefined && (
                        <Badge
                            variant={getBadgeVariant(card.confidence)}
                            className="shrink-0 font-medium px-3 py-1"
                        >
                            {Math.round(card.confidence * 100)}% Conf.
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-cascala-gray-600 tracking-wider uppercase">
                        Insight
                    </h4>
                    <div className="p-4 bg-cascala-gray-50 rounded-lg border border-cascala-gray-100">
                        <p className="text-sm text-cascala-gray-900 leading-relaxed">
                            {card.insight}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-cascala-gray-600 tracking-wider uppercase">
                        Reasoning
                    </h4>
                    <div className="p-4 bg-cascala-gray-50 rounded-lg border border-cascala-gray-100">
                        <p className="text-sm text-cascala-gray-900 leading-relaxed">
                            {card.reasoning}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}