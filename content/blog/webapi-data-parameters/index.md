---
title: Web API Data Parameters
date: "2019-04-28T21:49:23+01:00"
description: This post explains inner working of Web API Data Parameters and how to add a custom parameter
---

While using Magento 2 checkout API you probably noticed in [webapi.xml](https://github.com/magento/magento2/blob/2.3/app/code/Magento/Checkout/etc/webapi.xml#L26) nodes like this:

```xml{numberLines: true}
<data>
    <parameter name="cartId" force="true">%cart_id%</parameter>
</data>
```

This feature allows for the API consumers to skip passing current customer's cart id, this is taken care of the Magento
framework automatically.

But how do these parameters internally work and how to add a custom one?

Quick search by ```%cart_id%``` reveals this snippet in di.xml:
```xml
<type name="Magento\Webapi\Controller\Rest\ParamsOverrider">
    <arguments>
        <argument name="paramOverriders" xsi:type="array">
            <item name="%cart_id%" xsi:type="object">Magento\Quote\Model\Webapi\ParamOverriderCartId\Proxy</item>
        </argument>
    </arguments>
</type>
```

By looking at ```Magento\Quote\Model\Webapi\ParamOverriderCartId\Proxy``` class (*\Proxy is used for lazy loading*),
it's apparent that a custom parameters resolver has to implement the ```ParamOverriderInterface``` 
and this interface just a perfect example how code can be well-documented,
[have a read through it](https://github.com/magento/magento2/blob/2.3-develop/lib/internal/Magento/Framework/Webapi/Rest/Request/ParamOverriderInterface.php).
  
The other available parameter is ```%customer_id%``` and in a customization I introduced ```%admin_id%```
parameter which allows to attach custom information to admin user entity and then retrieve it
without explicitly passing or knowing admin's user id.
```xml
<type name="Magento\Webapi\Controller\Rest\ParamsOverrider">
    <arguments>
        <argument name="paramOverriders" xsi:type="array">
            <item name="%admin_id%" xsi:type="object">Vendor\Namespace\Controller\Rest\ParamOverriderAdminId</item>
        </argument>
    </arguments>
</type>
``` 

```php
<?php

namespace Vendor\Namespace\Controller\Rest;

use Magento\Authorization\Model\UserContextInterface;
use Magento\Framework\Webapi\Rest\Request\ParamOverriderInterface;

/**
 * Replaces a "%admin_id%" value with the admin user id
 */
class ParamOverriderAdminId implements ParamOverriderInterface
{
    /**
     * @var UserContextInterface
     */
    private $userContext;

    /**
     * @param UserContextInterface $userContext
     */
    public function __construct(UserContextInterface $userContext)
    {
        $this->userContext = $userContext;
    }

    /**
     * {@inheritDoc}
     */
    public function getOverriddenValue()
    {
        if ($this->userContext->getUserType() === UserContextInterface::USER_TYPE_ADMIN) {
            return $this->userContext->getUserId();
        }

        return null;
    }
}

```

New parameter can be used in ```webapi.xml``` as simple as:
```xml
<data>
    <parameter name="userId" force="true">%admin_id%</parameter>
</data>
```
