/**
 * ShareTransfer Model
 * Tracks all share token transfers with metadata
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define attributes interface
interface ShareTransferAttributes {
    id: number;
    shareTokenMint: string;
    tokenName: string;
    tokenSymbol: string;
    fromAddress: string;
    fromName?: string;
    fromId?: string;
    toAddress: string;
    toName?: string;
    toId?: string;
    amount: string;
    signature: string;
    explorerLink: string;
    note?: string;
    transferredAt: Date;
    metadata?: any;
}

// Define creation attributes (id is auto-generated)
interface ShareTransferCreationAttributes extends Optional<ShareTransferAttributes, 'id' | 'fromName' | 'fromId' | 'toName' | 'toId' | 'note' | 'metadata'> { }

// Define the model
class ShareTransfer extends Model<ShareTransferAttributes, ShareTransferCreationAttributes> implements ShareTransferAttributes {
    declare id: number;
    declare shareTokenMint: string;
    declare tokenName: string;
    declare tokenSymbol: string;
    declare fromAddress: string;
    declare fromName?: string;
    declare fromId?: string;
    declare toAddress: string;
    declare toName?: string;
    declare toId?: string;
    declare amount: string;
    declare signature: string;
    declare explorerLink: string;
    declare note?: string;
    declare transferredAt: Date;
    declare metadata?: any;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

ShareTransfer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        shareTokenMint: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'share_token_mint',
            comment: 'The mint address of the share token',
        },
        tokenName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'token_name',
            comment: 'Name of the share token',
        },
        tokenSymbol: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'token_symbol',
            comment: 'Symbol of the share token',
        },
        fromAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'from_address',
            comment: 'Sender wallet address',
        },
        fromName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'from_name',
            comment: 'Sender name',
        },
        fromId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'from_id',
            comment: 'Sender ID',
        },
        toAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'to_address',
            comment: 'Recipient wallet address',
        },
        toName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'to_name',
            comment: 'Recipient name',
        },
        toId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'to_id',
            comment: 'Recipient ID',
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Amount of shares transferred',
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Transaction signature',
        },
        explorerLink: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'explorer_link',
            comment: 'Solana Explorer link',
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Transfer note or memo',
        },
        transferredAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'transferred_at',
            defaultValue: DataTypes.NOW,
            comment: 'Transfer timestamp',
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata (JSON)',
        },
    },
    {
        sequelize,
        tableName: 'share_transfers',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['share_token_mint'],
            },
            {
                fields: ['from_address'],
            },
            {
                fields: ['to_address'],
            },
            {
                fields: ['transferred_at'],
            },
        ],
    }
);

export default ShareTransfer;
export { ShareTransferAttributes, ShareTransferCreationAttributes };

