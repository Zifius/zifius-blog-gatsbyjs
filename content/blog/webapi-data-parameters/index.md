---
title: Web API Data Parameters
date: "2019-04-28T21:49:23+01:00"
---

While using Magento 2 checkout API you probably noticed in [webapi.xml](https://github.com/magento/magento2/blob/2.3/app/code/Magento/Checkout/etc/webapi.xml#L26) nodes like this:

```xml{numberLines: true}
<data>
    <parameter name="cartId" force="true">%cart_id%</parameter>
</data>
```

This feature allows for the API consumers to skip passing current customer's cart id, this is taken care of Magento framework automatically.

But how does these parameters internally work and how to add a custom one?  