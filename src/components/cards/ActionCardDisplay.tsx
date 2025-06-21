// src/components/cards/ActionCardDisplay.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActionCard } from '@/types/chat';

interface ActionCardDisplayProps {
    card: ActionCard;
}

export default function ActionCardDisplay({ card }: ActionCardDisplayProps) {
    return (
        <Card className="mb-3 bg-white shadow-md text-left">
            <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-md font-semibold text-cascala-black">{card.title}</CardTitle>
                    {card.confidence !== undefined && (
                        <Badge variant="outline" className="ml-2 text-xs">
                            {Math.round(card.confidence * 100)}% Conf.
                        </Badge>
                    )}
                </div>
                <CardDescription className="text-xs text-cascala-gray-500">Patient: {card.patient}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pb-4 text-sm">
                <div>
                    <h4 className="text-xs font-medium text-cascala-gray-700 mb-0.5">Insight:</h4>
                    <p className="text-cascala-gray-900">{card.insight}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-cascala-gray-700 mb-0.5">Reasoning:</h4>
                    <p className="text-cascala-gray-900">{card.reasoning}</p>
                </div>
            </CardContent>
        </Card>
    );
}