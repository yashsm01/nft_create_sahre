/**
 * FractionalToken Model
 * Stores information about fractionalized NFTs and their share tokens
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define attributes interface
interface FractionalTokenAttributes {
    id: number;
    nftMintAddress: string;
    shareTokenMint: string;
    tokenName: string;
    tokenSymbol: string;
    totalShares: number;
    decimals: number;
    description?: string;
    imageUrl?: string;
    metadataAddress?: string;
    metadataUri?: string;
    creatorAddress: string;
    creatorName: string;
    creatorId?: string;
    explorerLink: string;
    isActive: boolean;
    metadata?: any;
}

// Define creation attributes
interface FractionalTokenCreationAttributes extends Optional<FractionalTokenAttributes, 'id' | 'description' | 'imageUrl' | 'metadataAddress' | 'metadataUri' | 'creatorId' | 'isActive' | 'metadata'> { }

// Define the model
class FractionalToken extends Model<FractionalTokenAttributes, FractionalTokenCreationAttributes> implements FractionalTokenAttributes {
    declare id: number;
    declare nftMintAddress: string;
    declare shareTokenMint: string;
    declare tokenName: string;
    declare tokenSymbol: string;
    declare totalShares: number;
    declare decimals: number;
    declare description?: string;
    declare imageUrl?: string;
    declare metadataAddress?: string;
    declare metadataUri?: string;
    declare creatorAddress: string;
    declare creatorName: string;
    declare creatorId?: string;
    declare explorerLink: string;
    declare isActive: boolean;
    declare metadata?: any;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

FractionalToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nftMintAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'nft_mint_address',
            comment: 'Original NFT mint address',
        },
        shareTokenMint: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'share_token_mint',
            comment: 'Share token mint address',
        },
        tokenName: {
            type: DataTypes.STRING(32),
            allowNull: false,
            field: 'token_name',
            comment: 'Token name',
        },
        tokenSymbol: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: 'token_symbol',
            comment: 'Token symbol',
        },
        totalShares: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'total_shares',
            comment: 'Total number of shares created',
        },
        decimals: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Token decimals',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Token description',
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'image_url',
            comment: 'Token image URL',
        },
        metadataAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'metadata_address',
            comment: 'On-chain metadata account address',
        },
        metadataUri: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'metadata_uri',
            comment: 'Metadata URI (Arweave, IPFS, etc.)',
        },
        creatorAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'creator_address',
            comment: 'Creator wallet address',
        },
        creatorName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'creator_name',
            comment: 'Creator name',
        },
        creatorId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'creator_id',
            comment: 'Creator ID',
        },
        explorerLink: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'explorer_link',
            comment: 'Solana Explorer link',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
            comment: 'Whether the token is active',
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata (JSON)',
        },
    },
    {
        sequelize,
        tableName: 'fractional_tokens',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['nft_mint_address'],
            },
            {
                fields: ['share_token_mint'],
            },
            {
                fields: ['creator_address'],
            },
            {
                fields: ['is_active'],
            },
        ],
    }
);

export default FractionalToken;
export { FractionalTokenAttributes, FractionalTokenCreationAttributes };

