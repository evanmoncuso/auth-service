import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import Permission from './permission';

@Entity({ name: 'users', })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'user_id', })
  id!: number;

  @Generated('uuid')
  @Column({ name: 'user_uuid', })
  uuid!: string;

  @Column({ nullable: false, unique: true, })
  username!: string;

  @Column({ nullable: false, select: true, })
  password!: string;

  @Column({ name: 'first_name', })
  firstName?: string;

  @Column({ name: 'last_name', })
  lastName?: string;

  @Column({ name: 'email_address', })
  emailAddress?: string;

  @ManyToMany(() => Permission, { eager: true, cascade: true, })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions!: Permission[];

  @CreateDateColumn({ name: 'created_at', })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'last_updated', })
  lastModified!: Date;
}

export interface UserInterface {
  id?: number;
  uuid?: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  permissions: string[];
  createdAt?: Date;
  lastModified?: Date;
}
