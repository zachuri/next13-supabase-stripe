# Next.js 13 + Supabase + Stripe Boilerplate

This is a boilerplate project that combines Next.js 13, Supabase, and Stripe to provide a starting point for building web applications. It includes a basic setup for integrating Supabase as the backend database and Stripe for handling payments.

## Demo

[https://next13-supabase-stripe.zachuri.com/login](https://next13-supabase-stripe.zachuri.com)

## Features

- Next.js 13 App Directory
- Supabase
- Stripe
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.

## Inspiration

I drew inspiration from Shadcn's innovative Taxonomy app, which provided a powerful categorization system. However, to enhance the backend functionality and streamline content management, I implemented Supabase as my backend solution. By integrating Supabase, I was able to efficiently store, organize, and retrieve inspiration content, allowing users to discover and explore curated collections based on the Taxonomy framework. This combination of Shadcn's inspiration and Supabase's backend capabilities resulted in a seamless and engaging experience for users seeking creative inspiration.

[Taxonomy by Shadcn](https://tx.shadcn.com/)

## Prerequisites

Before you begin, ensure that you have the following installed on your system:

- Node.js (version 14 or above)
- npm or yarn (package managers for Node.js)

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/zachuri/next13-supabase-stripe.git
   ```

2. Change into the project directory:

   ```
   cd next13-supabase-stripe
   ```

3. Install the dependencies:

   ```
   npm install
   # or
   yarn
   ```

4. Configure Supabase:
   - Create a Supabase project at **[supabase.io](https://supabase.io/)** if you haven't already.
   - Retrieve your Supabase project URL and API key.
   - Copy the **`.env.example`** file and rename it to **`.env.local`**.
   - Update the **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_KEY`** variables in the **`.env.local`** file with your Supabase project URL and API key respectively.
5. Configure Stripe:
   - Create a Stripe account at **[stripe.com](https://stripe.com/)** if you haven't already.
   - Retrieve your Stripe publishable key and secret key.
   - Update the **`.env.local`** file with your Stripe keys:

## **Supabase Setup**

1. Create a new project in your organization with a secure password.
2. Update the .env file with your Supabase environment variables:

   1. Navigate to Project Settings → API

   ```
   // Obtain in Supabase Project Settings
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

3. Navigate to Authentication.
   - Providers:
     - Enable the following providers:
       - Email (Default)
       - Github
     - Configure the Github provider:
       - Enable it.
       - Copy the redirect URL.
       - Add client ID and client secret from Github Developers.
         - Setup in Github Developer Settings:
           - Go to OAuth Apps.
           - Create a new OAuth Application.
           - Add the redirect URL from Supabase to the callback URL in Github.
           - Get the Client ID and Secret and add it to Supabase
   - URL Configuration:
     - Add a custom domain if needed.
     - Add additional Redirect URLs, including your localhost URL (e.g., **[http://localhost](http://localhost/)**).
4. SQL Editor:

   - Run the following SQL script to create tables and functions for authentication, Stripe, profiles, etc.:
   - Creating Queries for User Profiles and Stripe

     ```sql
     /**
     * USERS
     * Note: This table contains user data. Users should only be able to view and update their own data.
     */
     create table profiles (
       -- UUID from auth.users
       id uuid references auth.users on delete cascade not null primary key,
       updated_at timestamp with time zone,
       username text unique,
       full_name text,
       avatar_url text,
       bio text,
       website text,

       constraint username_length check (char_length(username) >= 3)
     );
     alter table profiles
       enable row level security;
     create policy "Public profiles are viewable by everyone." on profiles
       for select using (true);
     create policy "Can view own user data." on profiles
       for select using (auth.uid() = id);
     create policy "Can update own user data." on profiles
       for update using (auth.uid() = id);

     /**
     * This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
     */
     create function public.handle_new_user()
     returns trigger as
     $$
       begin
         insert into public.profiles (id, full_name, avatar_url)
         values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
         return new;
       end;
     $$
     language plpgsql security definer;

     create trigger on_auth_user_created
       after insert on auth.users
       for each row
         execute procedure public.handle_new_user();

     /**
     * This sets up storage for users to add avatar images
     */
     insert into storage.buckets (id, name)
       values ('avatars', 'avatars');

     -- Set up access controls for storage.
     -- See https://supabase.com/docs/guides/storage#policy-examples for more details.
     create policy "Avatar images are publicly accessible." on storage.objects
       for select using (bucket_id = 'avatars');

     create policy "Anyone can upload an avatar." on storage.objects
       for insert with check (bucket_id = 'avatars');

     /**
     * CUSTOMERS
     * Note: this is a private table that contains a mapping of user IDs to Strip customer IDs.
     */
     create table customers (
       -- UUID from auth.users
       id uuid references auth.users not null primary key,
       -- The user's customer ID in Stripe. User must not be able to update this.
       stripe_customer_id text
     );
     alter table customers enable row level security;
     -- No policies as this is a private table that the user must not have access to.

     /**
     * PRODUCTS
     * Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
     */
     create table products (
       -- Product ID from Stripe, e.g. prod_1234.
       id text primary key,
       -- Whether the product is currently available for purchase.
       active boolean,
       -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
       name text,
       -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
       description text,
       -- A URL of the product image in Stripe, meant to be displayable to the customer.
       image text,
       -- Set of key-value pairs, used to store additional information about the object in a structured format.
       metadata jsonb
     );
     alter table products
       enable row level security;
     create policy "Allow public read-only access." on products
       for select using (true);

     /**
     * PRICES
     * Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
     */
     create type pricing_type as enum ('one_time', 'recurring');
     create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
     create table prices (
       -- Price ID from Stripe, e.g. price_1234.
       id text primary key,
       -- The ID of the prduct that this price belongs to.
       product_id text references products,
       -- Whether the price can be used for new purchases.
       active boolean,
       -- A brief description of the price.
       description text,
       -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
       unit_amount bigint,
       -- Three-letter ISO currency code, in lowercase.
       currency text check (char_length(currency) = 3),
       -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
       type pricing_type,
       -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
       interval pricing_plan_interval,
       -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
       interval_count integer,
       -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
       trial_period_days integer,
       -- Set of key-value pairs, used to store additional information about the object in a structured format.
       metadata jsonb
     );
     alter table prices
       enable row level security;
     create policy "Allow public read-only access." on prices
       for select using (true);

     /**
     * SUBSCRIPTIONS
     * Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
     */
     create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');
     create table subscriptions (
       -- Subscription ID from Stripe, e.g. sub_1234.
       id text primary key,
       user_id uuid references auth.users not null,
       -- The status of the subscription object, one of subscription_status type above.
       status subscription_status,
       -- Set of key-value pairs, used to store additional information about the object in a structured format.
       metadata jsonb,
       -- ID of the price that created this subscription.
       price_id text references prices,
       -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
       quantity integer,
       -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
       cancel_at_period_end boolean,
       -- Time at which the subscription was created.
       created timestamp with time zone default timezone('utc'::text, now()) not null,
       -- Start of the current period that the subscription has been invoiced for.
       current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
       -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
       current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
       -- If the subscription has ended, the timestamp of the date the subscription ended.
       ended_at timestamp with time zone default timezone('utc'::text, now()),
       -- A date in the future at which the subscription will automatically get canceled.
       cancel_at timestamp with time zone default timezone('utc'::text, now()),
       -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
       canceled_at timestamp with time zone default timezone('utc'::text, now()),
       -- If the subscription has a trial, the beginning of that trial.
       trial_start timestamp with time zone default timezone('utc'::text, now()),
       -- If the subscription has a trial, the end of that trial.
       trial_end timestamp with time zone default timezone('utc'::text, now())
     );
     alter table subscriptions
       enable row level security;
     create policy "Can only view own subs data." on subscriptions
       for select using (auth.uid() = user_id);

     /**
      * REALTIME SUBSCRIPTIONS
      * Only allow realtime listening on public tables.
      */
     drop publication if exists supabase_realtime;
     create publication supabase_realtime
       for table products, prices;

     ```

5. Create types for Supabase:
   - Run the following command to generate typescript types:
     ```
     npx supabase gen types typescript --project-id [project-id] --schema public > src/types/supabase.db.ts
     ```
   - Make sure to add the generated types to your project in the specified location.

## **Stripe Setup**

1. Create a Stripe account if you haven't already.
2. Navigate to Developers → Webhooks
3. Use Ngrok to test on local
   1. Use a tunneling service like ngrok to tunnel your local development server.
   2. Obtain the forwarding URL from ngrok, which will be used for Stripe webhooks.
   3. Add the endpoint URL
      1. `[forwarding-url]/api/webhooks`
   4. Select events to listen to
      1. Select all events
   5. Reveal the signing Secret
      1. Copy the signing secret to → `STRIPE_WEBHOOK_SECRET` in your .env
4. Add your api keys
   1. Navigate to Developers to API keys
      1. Publishable key → **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** in your .env
      2. Secret key → `STRIPE_SECRET_KEY` in your .env
5. Test that you API works (Keep your ngrok tunnel online)
   1. Use the stripe cli to test your server
      1. stripe trigger payment_intent.succeeded
   2. Create a product
      1. Add a product in Stripe:
         - This will trigger a webhook request to your API endpoint (**`/api/webhooks`**) and insert the product into your Supabase database.

Make sure to follow these steps carefully to set up Supabase and Stripe correctly for your Next.js 13 + Supabase + Stripe boilerplate.
If you have any questions or would like me to make a video on how to setup. Star and hit me up!

## License

Licensed under the [MIT license](https://github.com/zachuri/next13-supabase-stripe/blob/main/LICENSE.md)
