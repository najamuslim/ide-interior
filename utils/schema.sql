create table user_credits (
  user_id text primary key,
  credits integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  order_id text not null,
  credits_added integer not null,
  transaction_status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);